import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { PERMISSIONS_KEY } from "@common/decorators";
import { Reflector } from "@nestjs/core";
import { PermissionEnum } from "@prisma/client";
import type { UserData } from "@common/guards";

@Injectable()
export class PermissionsGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const permissions = this.reflector.getAllAndOverride<PermissionEnum[]>(PERMISSIONS_KEY, [
			context.getHandler(),
			context.getClass()
		]);
		if (!permissions || permissions.length === 0) return true;

		// 判断用户是否有权限访问
		const request = context.switchToHttp().getRequest();
		const user: UserData = request.user;

		if (!user) {
			throw new UnauthorizedException("请先登录");
		}

		const isValid = user.permissions.some((permission) => permissions.includes(permission));
		if (!isValid) {
			throw new UnauthorizedException("没有权限访问");
		}

		return true;
	}
}
