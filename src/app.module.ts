import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SharedModule } from "./shared/shared.module";

@Module({
	imports: [SharedModule, ScheduleModule.forRoot()],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
