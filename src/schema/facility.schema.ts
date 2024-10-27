import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsDateString, ValidateNested } from "class-validator";
const bcrypt = require('bcrypt');

export class timeSlotValues{
    @IsDateString()
    startTime:Date

    @IsDateString()
    endTime:Date
}
@Schema({versionKey:false})
class Facility{
    @Prop({required:true})
    name:string

    @Prop({required:true})
    type:string

    @Prop({required:true})
    location:string

    @Prop({required:true})
    ownerId:string
    
    @Prop({required:true,min:1})
    pricePerHead:number

    @Prop({required:true,min:1})
    maxGroupSize:number
    
    @Prop({ required: true, maxlength: 24, minlength: 1 })
    @IsArray() // Ensures it's an array
    @ArrayMinSize(1, { message: 'timeSlots must contain at least 1 element' }) // Enforce array size >= 1
    @ValidateNested({ each: true }) // Validates each element in the array
    @Type(() => timeSlotValues) // Ensures transformation to the correct type
    timeSlots: timeSlotValues[];
}

export type FacilityDocument=Document & Facility

export const FacilitySchema=SchemaFactory.createForClass(Facility)

export const FacilityModel=Facility.name

