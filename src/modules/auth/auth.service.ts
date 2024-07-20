import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "@prisma.service";
import { LoginEntity } from "./entities/login.entity";

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService
	) {}

	/** 登录 */
	async login() {
		const user = await this.prismaService.user.findUnique({ where: { id: 1 } });
		if (!user) {
			throw new NotFoundException("查找不到用户");
		}

		const token = await this.generateToken(user.id);

		return new LoginEntity(token);
	}

	/** 生成token */
	private generateToken(userId: number) {
		return this.jwtService.signAsync({ sub: userId });
	}
}
