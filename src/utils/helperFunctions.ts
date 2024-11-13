import { BadRequestException, HttpException, HttpStatus } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { CONSTANTS } from "./constants";
import { JsonWebTokenError } from "@nestjs/jwt";
import { config } from "src/common/config";
import { timeSlotValues } from "src/schema/facility.schema";
import mongoose from "mongoose";
const jwt=require('jsonwebtoken')
const bcrypt = require('bcrypt');

export class HelperFunctions{

    validateToken(token:string){
        try {
            const payload=jwt.verify(token,config.jwt.secretKey);
            return payload.data;
        } catch (error) {
            throw error;
        }
    }

    async checkPassword(plainPassword, hashedPassword) {
      try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        if (isMatch) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error('Error while checking password:', error);
        throw error;
      }
  }
    createResObj(statusCode,data,message="Success"){
        return {
            statusCode,
            message,
            data
        }
    }

    async requestBodyValidation(dto:any,body:any){
        try{
          const requestFields=Object.keys(JSON.parse(JSON.stringify(body)));
          if(requestFields.length==0){
            throw new BadRequestException('Request cannot be empty');
          }
    
          requestFields.forEach((fieldNames)=>{
            if(!CONSTANTS.dtoFields[dto.name].includes(fieldNames)){
              
              throw new BadRequestException(`No valid field named ${fieldNames}`)
            }
          })
          const userDto = plainToClass(dto, body);
          const errors = await validate(userDto);
          
          if(errors.length>0){
            throw new BadRequestException({'field':errors[0].property});
          }  
      }catch(error){
        throw error;
      }
    }

    async lineSweepAlgoForOverlapCheck(timeSlots:Array<timeSlotValues>){
      try {
        let timeSlotInSeconds=[]
        if(timeSlots.filter((timeSlot)=>{timeSlot.startTime==timeSlot.endTime}).length>0){
          throw new BadRequestException('Start and end time cant be the same');
        }
        timeSlots.map((timeSlot)=>{
          const startTime = Math.floor(new Date(timeSlot.startTime).getTime() / 1000);
          const endTime = Math.floor(new Date(timeSlot.endTime).getTime() / 1000);
          timeSlotInSeconds.push([startTime,1])
          timeSlotInSeconds.push([endTime,-1])
        })
        timeSlotInSeconds.sort()
        let currentoverlaps=0,totaloverlaps=0;
        timeSlotInSeconds.forEach((time)=>{
          currentoverlaps+=time[1];
          totaloverlaps=Math.max(currentoverlaps,totaloverlaps);
        })
        if(totaloverlaps>1){
          throw new BadRequestException('Timeslots overlap each other');
        }
        return true;
      } catch (error) {
        throw error;
      }
    }

    getNextWeekMidnight() {
      const today = new Date();
    
      // Set the time of today to midnight
      today.setHours(0, 0, 0, 0);
    
      // Add 7 days to get to the same day next week
      const nextWeekMidnight = new Date(today);
      nextWeekMidnight.setDate(today.getDate() + 7);
    
      return nextWeekMidnight.getTime();
    }
    createErrResBody(error){
        if(error?.code || error?.response?.field){
            const code=error.code
            if(code){
              if(code==11000)
                return new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: CONSTANTS.errorCodes[code](Object.keys(error?.keyValue)[0]),data:{} }, HttpStatus.BAD_REQUEST);
            }else{
              return new HttpException({ statusCode: HttpStatus.BAD_REQUEST ,message: CONSTANTS.msgValidation[error['response']['field']],data:{}}, HttpStatus.BAD_REQUEST);
            }
        }
        if(error instanceof HttpException){
          return new HttpException({ statusCode: error['status'], message: error.message ,data:{}}, error['status']);
        }
        if(error instanceof JsonWebTokenError){
          return new HttpException({ statusCode: 401, message: 'Invalid token or token expired' ,data:{}}, HttpStatus.UNAUTHORIZED);
        }
        if(error instanceof mongoose.Error.ValidationError){
          return new HttpException({ statusCode: HttpStatus.BAD_REQUEST ,message: CONSTANTS.msgValidation[Object.keys(error['errors'])[0]],data:{}}, HttpStatus.BAD_REQUEST);
        }
        console.log(error);
        return new HttpException({ statusCode: 500, message: 'Internal Server Error' ,data:error}, HttpStatus.INTERNAL_SERVER_ERROR);
      
      }
}