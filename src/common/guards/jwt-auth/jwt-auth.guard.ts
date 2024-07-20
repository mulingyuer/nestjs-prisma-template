import {
	CanActivate,
	ExecutionContext,
	HttpException,
	Injectable,
	UnauthorizedException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import { PrismaService } from "@prisma.service";
import type { JwtPayload, UserData } from "./types";
export type * from "./types";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "@common/decorators";

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly prismaService: PrismaService,
		private readonly reflector: Reflector
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		// 判断是不是公共路由
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass()
		]);
		if (isPublic) return true;

		const request = context.switchToHttp().getRequest<Request>();
		const token = this.extractTokenFromHeader(request);
		if (!token) {
			throw new UnauthorizedException("需要身份认证");
		}

		// 解析token，验证用户身份
		try {
			const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
				secret: this.configService.get("JWT_SECRET")
			});

			const userData = await this.getUserInfo(payload.sub);
			if (!userData) {
				throw new UnauthorizedException("用户不存在或已删除");
			}

			request["user"] = userData;
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			throw new UnauthorizedException("身份验证失败");
		}

		return true;
	}

	/** 从头信息获取token */
	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(" ") ?? [];
		return type === "Bearer" ? token : undefined;
	}

	/** 获取用户信息 */
	private getUserInfo(userId: number): Promise<UserData> {
		return this.prismaService.user.findUnique({
			where: {
				id: userId
			}
		});
	}
}
