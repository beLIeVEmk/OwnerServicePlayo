import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Model } from 'mongoose';
import { FacilityDocument, FacilityModel } from 'src/schema/facility.schema';

@Injectable()
export class ScheduleService {

  constructor(private schedulerRegistry: SchedulerRegistry) {}

  

  async scheduleOneTimeTask(functionToExecute) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 8);
    targetDate.setHours(0, 0, 0, 0); // Midnight
    const job = new CronJob(targetDate, async () => {
      await functionToExecute();
      this.schedulerRegistry.deleteCronJob('oneTimeTask');
    });

    // Register the job with a unique name
    this.schedulerRegistry.addCronJob('oneTimeTask', job);
    job.start();
  }
}
