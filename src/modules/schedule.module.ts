import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongoModule } from 'src/database/mongo.module';
import { FacilityService } from 'src/services/facility.service';
import { ScheduleService } from 'src/services/schedule.service';
import { HelperFunctions } from 'src/utils/helperFunctions';
import { MongooseModule } from '@nestjs/mongoose';
import { FacilityModel, FacilitySchema } from 'src/schema/facility.schema'; // Import the schema
import { config } from 'src/common/config';

@Module({
  imports: [
    ScheduleModule,
  ],
  providers: [ScheduleService,FacilityService],
})
export class SchedulesModule {}
