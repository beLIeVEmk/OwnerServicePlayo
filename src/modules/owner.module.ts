import { Module } from '@nestjs/common';
import { OwnerController } from 'src/controllers/owner.controller';
import { MongoModule } from 'src/database/mongo.module';
import { FacilityService } from 'src/services/facility.service';
import { OwnerService } from 'src/services/owner.service';
import { HelperFunctions } from 'src/utils/helperFunctions';


@Module({
  imports: [MongoModule],
  controllers: [OwnerController],
  providers: [OwnerService,HelperFunctions,FacilityService],
})
export class OwnerModule {}