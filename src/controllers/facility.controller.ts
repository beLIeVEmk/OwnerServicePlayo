import { Body, Controller, Get, HttpCode, Post,Headers, Query, UnauthorizedException, HttpStatus, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import CreateFacilityDto from 'src/dto/createFacility.dto';
import UpdateFacilityDto from 'src/dto/updateFacility.dto';
import UpdateProfileDto from 'src/dto/updateprofile.dto';
import { FacilityService } from 'src/services/facility.service';
import { OwnerService } from 'src/services/owner.service';
import { HelperFunctions } from 'src/utils/helperFunctions';

@Controller('facility')
export class FacilityController {

    constructor(
        private readonly helperFunctions:HelperFunctions,
        private readonly facService:FacilityService
    ){}

    @HttpCode(201)
    @Post('createFacility')
    async signUp(@Headers('authorization') jwtToken:string,@Body() reqBody:CreateFacilityDto) {
        try {
            const userData=await this.helperFunctions.validateToken(jwtToken);
            if(userData.role!='owner'){
                throw new UnauthorizedException('Not allowed to perform operation');
            }
            await this.helperFunctions.requestBodyValidation(CreateFacilityDto,reqBody);
            const facilityInfo=await this.facService.createFacility(reqBody,userData['_id']);
            return this.helperFunctions.createResObj(HttpStatus.CREATED,facilityInfo);
        } catch (error) {
            throw this.helperFunctions.createErrResBody(error);
        }
    }

    @HttpCode(200)
    @Delete('deleteFacility')
    async deleteFacility(@Headers('Authorization') jwtToken:string,@Query('id') facilityId:string) {
        try {
            const userData=await this.helperFunctions.validateToken(jwtToken);
            if(userData.role!='owner'){
                throw new UnauthorizedException('Not allowed to perform operation');
            }
            await this.facService.deleteFacility(facilityId);
            return this.helperFunctions.createResObj(HttpStatus.OK,{});
        } catch (error) {
            throw this.helperFunctions.createErrResBody(error);
        }
    }

    @HttpCode(200)
    @Get('facilityInfo')
    async getFacInfo(@Headers('Authorization') jwtToken:string,@Query('id') facilityId:string){
        try {
            const userData=await this.helperFunctions.validateToken(jwtToken);
            if(userData.role!='owner'){
                throw new UnauthorizedException('Not allowed to perform operation');
            }
            const response=this.facService.getFacInfo(facilityId,userData['_id']);
            return this.helperFunctions.createResObj(HttpStatus.OK,response);
        } catch (error) {
            throw this.helperFunctions.createErrResBody(error);
        }
    }

    @HttpCode(200)
    @Get('getAllFacilities')
    async getFacDetails(@Headers('Authorization') jwtToken:string){
        try {
            const userData=await this.helperFunctions.validateToken(jwtToken);
            if(userData.role!='owner'){
                throw new UnauthorizedException('Not allowed to perform operation');
            }
            const facInfo=await this.facService.getAllFacsOfOwner(userData['_id']);
            return this.helperFunctions.createResObj(HttpStatus.OK,facInfo);
        } catch (error) {
            throw this.helperFunctions.createErrResBody(error);
        }
    }

    @HttpCode(200)
    @Patch('updateFacility')
    async updateFacility(@Headers('Authorization') jwtToken:string,@Query('id') facilityId:string,@Body() reqBody:UpdateFacilityDto){
        try {
            const userData=await this.helperFunctions.validateToken(jwtToken);
            if(userData.role!='owner'){
                throw new UnauthorizedException('Not allowed to perform operation');
            }
            await this.helperFunctions.requestBodyValidation(UpdateFacilityDto,reqBody);
            const response=await this.facService.updateFacility(facilityId,reqBody);
            return this.helperFunctions.createResObj(HttpStatus.OK,{});
        } catch (error) {
            throw this.helperFunctions.createErrResBody(error);
        }
    }
}
