import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { Public } from "@/common/decorators";
import { LoginEntity } from "./entities/login.entity";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	/** 登录 */
	@Get("login")
	@Public()
	@ApiResponse({ status: HttpStatus.OK, type: LoginEntity })
	login() {
		return this.authService.login();
	}
}
