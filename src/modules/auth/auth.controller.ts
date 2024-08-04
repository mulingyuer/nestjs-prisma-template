import { Public } from "@/common/decorators";
import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	/** 登录 */
	@Get("login")
	@Public()
	login() {
		return this.authService.login();
	}
}
