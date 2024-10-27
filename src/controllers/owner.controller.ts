import { Body, Controller, Get, HttpCode, Post,Headers, Query, UnauthorizedException, HttpStatus, Patch, Param, Delete } from '@nestjs/common';
import UpdateProfileDto from 'src/dto/updateprofile.dto';
import { OwnerService } from 'src/services/owner.service';
import { HelperFunctions } from 'src/utils/helperFunctions';

@Controller('owner')
export class OwnerController {

    constructor(
        private readonly helperFunctions:HelperFunctions,
        private readonly ownerService:OwnerService
    ){}

    @HttpCode(201)
    @Get('getUserInfo')
    async signUp(@Headers('authorization') jwtToken:string) {
        try {
            const userData=await this.helperFunctions.validateToken(jwtToken);
            if(userData.role!='owner'){
                throw new UnauthorizedException('Not allowed to perform operation');
            }
            const ownerDetails=await this.ownerService.getOwnerProfile(userData['_id']);
            return this.helperFunctions.createResObj(HttpStatus.OK,ownerDetails);
        } catch (error) {
            throw this.helperFunctions.createErrResBody(error);
        }
    }

    @HttpCode(200)
    @Patch('updateProfile')
    async updateOwnerProfile(@Headers('Authorization') jwtToken:string,@Body() reqBody:UpdateProfileDto){
        try {
            const userData=await this.helperFunctions.validateToken(jwtToken);
            await this.helperFunctions.requestBodyValidation(UpdateProfileDto,reqBody);
            const updateOwnerDetails=await this.ownerService.updateOwnerProfile(reqBody,userData['_id']);
            return this.helperFunctions.createResObj(HttpStatus.OK,updateOwnerDetails);
        } catch (error) {
            throw this.helperFunctions.createErrResBody(error);
        }
    }

    @HttpCode(200)
    @Delete('deleteProfile')
    async deleteOwnerProfile(@Headers('Authorization') jwtToken:string){
        try {
            
        } catch (error) {
            throw this.helperFunctions.createErrResBody(error);
        }
    }
}
