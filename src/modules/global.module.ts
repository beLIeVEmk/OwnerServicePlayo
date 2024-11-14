import { Module, Global } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongoModule } from 'src/database/mongo.module';
import { HelperFunctions } from 'src/utils/helperFunctions';


@Global()
@Module({
    imports:[MongoModule,ScheduleModule.forRoot()],
    providers: [HelperFunctions],
    exports: [HelperFunctions,MongoModule,ScheduleModule],
})
export class GlobalModule {}
