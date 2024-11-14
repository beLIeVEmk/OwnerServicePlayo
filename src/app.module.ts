import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OwnerModule } from './modules/owner.module';
import { FacilityModule } from './modules/facility.module';
import { HelperFunctions } from './utils/helperFunctions';
import { GlobalModule } from './modules/global.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { SchedulesModule } from './modules/schedule.module';

@Module({
  imports: [OwnerModule,FacilityModule,GlobalModule,
    ThrottlerModule.forRoot({
      throttlers:[
        {
          ttl:60,
          limit:10
        }
      ]
    }),
    SchedulesModule
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD, // Apply globally using ThrottlerGuard
    useClass: ThrottlerGuard,
  },],
})
export class AppModule {}
