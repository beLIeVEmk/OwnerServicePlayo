import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsDateString, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Validate, ValidateNested } from "class-validator";

export class timeSlotValues{

    @IsDateString()
    startTime:Date

    @IsDateString()
    endTime:Date

    @IsString()
    timeSlotId:string
}
class CreateFacilityDto{
    @IsString()
    @IsNotEmpty()
    name:string

    @IsString()
    @IsNotEmpty()
    type:string

    @IsString()
    @IsNotEmpty()
    location:string

    @IsString()
    @IsOptional()
    ownerId:string
    
    @IsNumber()
    @IsNotEmpty()
    pricePerHead:number

    @IsNumber()
    @IsNotEmpty()
    maxGroupSize:number
    
    @IsArray()
    @ArrayMinSize(1, { message: 'timeSlots must contain at least 1 element' })
    @ValidateNested({ each: true })
    @Type(() => timeSlotValues)
    timeSlots: timeSlotValues[];
}

export default CreateFacilityDto