import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OwnerModule } from './modules/owner.module';
import { FacilityModule } from './modules/facility.module';

@Module({
  imports: [OwnerModule,FacilityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
