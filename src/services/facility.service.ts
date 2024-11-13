import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isObject } from "class-validator";
import { get, Model } from "mongoose";
import CreateFacilityDto from "src/dto/createFacility.dto";
import UpdateFacilityDto from "src/dto/updateFacility.dto";
import { FacilityDocument, FacilityModel } from "src/schema/facility.schema";
import { OwnerDocument, OwnerModel } from "src/schema/ownerprofile.schema";
import { CONSTANTS } from "src/utils/constants";
import { HelperFunctions } from "src/utils/helperFunctions";


@Injectable()
export class FacilityService{
    constructor(@InjectModel(FacilityModel) private readonly facModel:Model<FacilityDocument>,
                private readonly helperFunctions:HelperFunctions){}

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

            await this.facModel.updateOne({_id:facilityId},{delFlag:this.helperFunctions.getNextWeekMidnight()})
            // should be made effective on 8th day and delfalg =1
            if(!isObject(facilityId)){
                throw new BadRequestException('Invalid facilityId')
            }
            const deleteFacilityResponse=await this.facModel.deleteOne({_id:facilityId});
            if(deleteFacilityResponse.deletedCount==1){
                return true;
            }
            throw new BadRequestException('Invalid facilityId request');
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
            if(facInfo.ownerId==uid){
                return facInfo;
            }
            throw new BadRequestException('Invalid facilityId request');
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
            // should be made effective after a week (8th day) - cron tab
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
            
            return await this.facModel.findOneAndUpdate({_id:facilityId},{...reqBody});
        } catch (error) {
            throw error;
        }
    }

    async deleteAllFacsOfowner(ownerId:string){
        try {
            await this.facModel.updateMany({ownerId},{delFlag:1});
            // should be made effective on 8th day and delflag=1 - use individual id and NOT DelteAll
            return await this.facModel.deleteMany({$and:[{ownerId},{delFlag:{$ne:-1}}]});
        } catch (error) {
            throw error
        }
    }
}