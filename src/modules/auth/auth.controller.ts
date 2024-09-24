import { Public } from "@/common/decorators";
import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dto";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	/** 注册账号 */
	@Post("register")
	@Public()
	register(@Body() body: RegisterDto) {
		return this.authService.register(body);
	}

	/** 登录 */
	@Post("login")
	@Public()
	login(@Body() body: LoginDto) {
		return this.authService.login(body);
	}
}
