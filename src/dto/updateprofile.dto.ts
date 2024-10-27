import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

class UpdateProfileDto{
    @IsEmail()
    @IsNotEmpty()
    @IsOptional()
    oldEmail:string

    @IsEmail()
    @IsNotEmpty()
    @IsOptional()
    newEmail:string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    oldPassword:string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    newPassword:string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    address:string
}

export default UpdateProfileDto