import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsDateString, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Validate, ValidateNested } from "class-validator";

class timeSlotValues{

    @IsDateString()
    startTime:Date

    @IsDateString()
    endTime:Date

    @IsString()
    timeSlotId:string
}
class UpdateFacilityDto{
    @IsString()
    @IsOptional()
    name:string

    @IsString()
    @IsOptional()
    type:string

    @IsString()
    @IsOptional()
    location:string
    
    @IsNumber()
    @IsOptional()
    pricePerHead:number

    @IsNumber()
    @IsOptional()
    maxGroupSize:number
    
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1, { message: 'addtimeSlots must contain at least 1 element' })
    @ValidateNested({ each: true })
    @Type(() => timeSlotValues)
    addtimeSlots: timeSlotValues[];

    @IsOptional()
    @IsArray()
    @ArrayMinSize(1, { message: 'deltimeSlots must contain at least 1 element' })
    @ValidateNested({ each: true })
    deltimeSlots:Array<String>;
}

export default UpdateFacilityDto