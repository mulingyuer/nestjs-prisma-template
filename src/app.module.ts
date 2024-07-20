import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SharedModule } from "./shared/shared.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
	imports: [SharedModule, AuthModule, ScheduleModule.forRoot()],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
