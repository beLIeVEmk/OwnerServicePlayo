import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { get, Model } from "mongoose";
import UpdateProfileDto from "src/dto/updateprofile.dto";
import { OwnerDocument, OwnerModel } from "src/schema/ownerprofile.schema";
import { CONSTANTS } from "src/utils/constants";
import { HelperFunctions } from "src/utils/helperFunctions";
import { FacilityService } from "./facility.service";


@Injectable()
export class OwnerService{
    constructor(@InjectModel(OwnerModel) private readonly userModel:Model<OwnerDocument>,
                private readonly helperFunctions:HelperFunctions,
                private readonly facService:FacilityService){}

    async getOwnerProfile(uuid:string){
        try {
            return await this.userModel.findById(uuid,{password:0});
        } catch (error) {
            throw error;
        }
    }

    async updateOwnerProfile(reqBody:UpdateProfileDto,uuid:string){
        try {
            let toUpdatePayload={}
            const userData=await this.getOwnerProfile(uuid);
            if(reqBody.oldEmail){
                if(reqBody.oldEmail!=userData.email){
                    throw new BadRequestException('Emails do not match')
                }
                if(reqBody.newEmail){
                    toUpdatePayload['email']=reqBody.newEmail
                }else{
                    throw new BadRequestException(CONSTANTS.msgValidation.email)
                }
            }
            if(reqBody.oldPassword){
                if(!await this.helperFunctions.checkPassword(reqBody.oldPassword,userData.password)){
                    throw new BadRequestException('Passwords do not match')
                }
                if(reqBody.newEmail){
                    toUpdatePayload['password']=reqBody.newPassword
                }else{
                    throw new BadRequestException(CONSTANTS.msgValidation.password)
                }
            }
            if(reqBody.address){
                toUpdatePayload['address']=reqBody.address
            }
            return await this.userModel.updateOne({_id:uuid},{...toUpdatePayload},{upsert:true});
        } catch (error) {
            throw error
        }
    }

    async deleteOwnerProfile(ownerId:string){
        try {
            const ownerData=await this.userModel.deleteOne({_id:ownerId});
            if(ownerData.deletedCount==0){
                throw new BadRequestException('Invalid request')
            }
            await this.facService.deleteAllFacsOfowner(ownerId);
            return true;
        } catch (error) {
            throw error;
        }
    }
}