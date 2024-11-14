import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SchedulerRegistry } from "@nestjs/schedule";
import { isObject } from "class-validator";
import { CronJob } from "cron";
import { get, Model } from "mongoose";
import CreateFacilityDto from "src/dto/createFacility.dto";
import UpdateFacilityDto from "src/dto/updateFacility.dto";
import { FacilityDocument, FacilityModel } from "src/schema/facility.schema";
import { HelperFunctions } from "src/utils/helperFunctions";


@Injectable()
export class FacilityService{
    constructor(@InjectModel(FacilityModel) private readonly facModel:Model<FacilityDocument>,
                private readonly helperFunctions:HelperFunctions,
                private schedulerRegistry: SchedulerRegistry){}

    async createFacility(reqBody:CreateFacilityDto,uuid:string){
        try {
            reqBody.ownerId=uuid;
            await this.helperFunctions.lineSweepAlgoForOverlapCheck(reqBody.timeSlots);
            return await this.facModel.create(reqBody);
        } catch (error) {
            throw error
        }
    }

    async deleteFacility(facilityId:string){
        try {
            if(!isObject(facilityId)){
                throw new BadRequestException('Invalid facilityId')
            }
            const response=await this.facModel.updateOne({_id:facilityId},{delFlag:this.helperFunctions.getNextWeekMidnight()})
            if(response.modifiedCount==0){
                throw new BadRequestException('Invalid facilityId request')
            }
            // should be made effective on 8th day and delfalg =1
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + 8);
            targetDate.setHours(0, 0, 0, 0);
            const job = new CronJob(targetDate, async () => {
                const deleteFacilityResponse=await this.facModel.deleteOne({_id:facilityId});
                this.schedulerRegistry.deleteCronJob(`deleteFacility_${facilityId}`);
            });
            this.schedulerRegistry.addCronJob(`deleteFacility_${facilityId}`, job);
            job.start();
            return true;
        } catch (error) {
            throw error;
        }
    }

    async getFacInfo(facilityId:string,uid:string){
        try {
            if(!isObject(facilityId)){
                throw new BadRequestException('Invalid facilityId')
            }
            const facInfo=await this.facModel.findById(facilityId);
            if(facInfo.ownerId!=uid){
                throw new BadRequestException('Invalid facilityId request');                
            }
            return facInfo;
        } catch (error) {
            throw error;
        }
    }

    async getAllFacsOfOwner(ownerId:string){
        try {
            return await this.facModel.find({ownerId});
        } catch (error) {
            throw error;
        }
    }

    async updateFacility(facilityId:string,reqBody:UpdateFacilityDto){
        try {
            
            if(!isObject(facilityId)){
                throw new BadRequestException('Invalid facilityId')
            }
            let response=(await this.facModel.findOne({_id:facilityId},{timeSlots:1}));
            if(!response){
                throw new BadRequestException('Invalid update request');
            }
            if(response.delFlag!=-1){
                throw new BadRequestException('Have opted to delete the facility so cant perform operation.')
            }
            let timeSlot=response.timeSlots
            if(reqBody.addtimeSlots || reqBody.deltimeSlots){
                if(reqBody.deltimeSlots){
                    const startTime=new Map();
                    reqBody.deltimeSlots.forEach((time)=>{
                        startTime.set(time,1);
                    })
                    timeSlot=timeSlot.filter((time)=>{
                        return !startTime.has(time.timeSlotId)
                    })
                }
                
                timeSlot=timeSlot.concat(reqBody.addtimeSlots);
                await this.helperFunctions.lineSweepAlgoForOverlapCheck(timeSlot);
            
                delete reqBody.addtimeSlots;
                delete reqBody.deltimeSlots;
                reqBody['timeSlots']=timeSlot;
            }
            // should be made effective after a week (8th day) - cron tab
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + 8);
            targetDate.setHours(0, 0, 0, 0);
            const job = new CronJob(targetDate, async () => {
                await this.facModel.findOneAndUpdate({_id:facilityId},{...reqBody});
                this.schedulerRegistry.deleteCronJob(`updateFacility_${facilityId}`);
            });
            this.schedulerRegistry.addCronJob(`updateFacility_${facilityId}`, job);
            job.start();
            return true;
        } catch (error) {
            throw error;
        }
    }

    async deleteAllFacsOfowner(ownerId:string){
        try {
            const response=await this.facModel.updateMany({ownerId},{delFlag:1});
            // should be made effective on 8th day and delflag=1 - use individual id and NOT DelteAll
            if(response.modifiedCount==0){
                throw new BadRequestException('Invalid facility request')
            }
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + 8);
            targetDate.setHours(0, 0, 0, 0);
            const job = new CronJob(targetDate, async () => {
                await this.facModel.deleteMany({$and:[{ownerId},{delFlag:{$ne:-1}}]});
                this.schedulerRegistry.deleteCronJob(`deleteAllFacsOfowner_${ownerId}`);
            });
            this.schedulerRegistry.addCronJob(`deleteAllFacsOfowner_${ownerId}`, job);
            job.start();
            return true;
        } catch (error) {
            throw error
        }
    }
}