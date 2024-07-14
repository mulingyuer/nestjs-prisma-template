import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import type { UserData } from "./types";
export type * from "./types";

export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	return request.user as UserData;
});
