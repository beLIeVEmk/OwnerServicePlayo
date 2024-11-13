import { Module, Global } from '@nestjs/common';
import { MongoModule } from 'src/database/mongo.module';
import { HelperFunctions } from 'src/utils/helperFunctions';


@Global()
@Module({
    imports:[MongoModule],
    providers: [HelperFunctions],
    exports: [HelperFunctions,MongoModule],
})
export class GlobalModule {}
