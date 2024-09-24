import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { ROLES_KEY } from "@common/decorators";
import { Reflector } from "@nestjs/core";
import { RoleNameEnum } from "@prisma/client";
import type { UserData } from "@common/guards";

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const roles = this.reflector.getAllAndOverride<RoleNameEnum[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass()
		]);
		if (!roles || roles.length === 0) return true;

		// 判断用户是否有权限访问
		const request = context.switchToHttp().getRequest();
		const user: UserData = request.user;

		if (!user) {
			throw new UnauthorizedException("请先登录");
		}

		const isValid = user.roles.some((role) => roles.includes(role));
		if (!isValid) {
			throw new UnauthorizedException("没有权限访问");
		}

		return true;
	}
}
