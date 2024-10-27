
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'src/common/config';
import { FacilityModel, FacilitySchema } from 'src/schema/facility.schema';
import { OwnerModel, OwnerSchema } from 'src/schema/ownerprofile.schema';

@Module({
  imports: [MongooseModule.forRoot(config.db.mongo.database.connectionString),
    MongooseModule.forFeature([{ name: OwnerModel, schema: OwnerSchema,collection:config.db.mongo.collections.user }]),
    MongooseModule.forFeature([{ name: FacilityModel, schema: FacilitySchema,collection:config.db.mongo.collections.facility }])
  ],
  exports:[MongooseModule]
})
export class MongoModule {}
