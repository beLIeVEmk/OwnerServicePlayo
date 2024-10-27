import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
const bcrypt = require('bcrypt');

@Schema({versionKey:false})
class Owner{
    @Prop({required:true})
    name:string

    @Prop({required:false})
    password:string

    @Prop({required:true,unique:true})
    email:string
    
    @Prop({required:false})
    address:string

    @Prop({required:true})
    role:string
}

export type OwnerDocument=Document & Owner

export const OwnerSchema=SchemaFactory.createForClass(Owner)

export const OwnerModel=Owner.name

OwnerSchema.pre('save', function(next)  {
    bcrypt.hash(this.password, 10, (error, hash)=> {
      if (error) {
        return next(error);
      } else {
        this.password = hash;
        next();
      }
    });
});