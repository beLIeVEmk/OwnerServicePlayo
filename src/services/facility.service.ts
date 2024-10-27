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
            let timeSlot=(await this.facModel.findOne({_id:facilityId},{timeSlots:1})).timeSlots;
            
            if(reqBody.addtimeSlots || reqBody.deltimeSlots){
                if(reqBody.deltimeSlots){
                    const startTime=new Map();
                    reqBody.deltimeSlots.forEach((time)=>{
                        startTime.set(time.startTime,1);
                    })
                    timeSlot=timeSlot.filter((time)=>{
                        return !startTime.has(time.startTime)
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
            return await this.facModel.deleteMany({ownerId});
        } catch (error) {
            throw error
        }
    }
}