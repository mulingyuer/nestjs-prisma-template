import { Controller, Get, HttpStatus } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Public } from "@common/decorators";

@Controller()
@ApiTags("hello")
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	@Public()
	@ApiResponse({ status: HttpStatus.OK, type: "" })
	getHello(): string {
		return this.appService.getHello();
	}
}
