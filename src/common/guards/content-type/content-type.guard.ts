/*
 * @Author: mulingyuer
 * @Date: 2024-07-04 09:29:58
 * @LastEditTime: 2024-07-10 17:32:57
 * @LastEditors: mulingyuer
 * @Description: content-type 校验
 * @FilePath: \ease-change-backend\src\common\guards\content-type\content-type.guard.ts
 * 怎么可能会有bug！！！
 */
import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import type { ContentType } from "./types";
export type * from "./types";
import { IS_CONTENT_TYPE_KEY } from "@common/decorators";
import type { Request } from "express";
import { Reflector } from "@nestjs/core";

@Injectable()
export class ContentTypeGuard implements CanActivate {
	private static defaultContentTypes: ContentType | null = null;

	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		// 获取单独指定content-type
		const isContentType = this.reflector.getAllAndOverride<ContentType>(IS_CONTENT_TYPE_KEY, [
			context.getHandler(),
			context.getClass()
		]);
		if (isContentType === "none") return true;
		if (ContentTypeGuard.defaultContentTypes === "none") return true;

		const requiredContentType = isContentType || ContentTypeGuard.defaultContentTypes;
		if (!requiredContentType) return true;

		// 比对
		const request = context.switchToHttp().getRequest<Request>();
		// 如果是get请求，除非是元数据中要求了，否则不要求content-type校验
		const whiteList = ["GET", "OPTIONS", "DELETE"];
		if (whiteList.includes(request.method) && !isContentType) return true;
		const contentType = request.headers["content-type"];
		// 检查 contentType 是否存在
		if (!contentType) {
			throw new BadRequestException("头信息缺少content-type");
		}
		// 比较，忽略大小写
		if (!contentType.toLowerCase().includes(requiredContentType.toLowerCase())) {
			throw new BadRequestException(`content-type 必须为 ${requiredContentType}`);
		}

		return true;
	}

	static setContentTypes(contentType: ContentType): void {
		ContentTypeGuard.defaultContentTypes = contentType;
	}
}

/** 守卫工厂 */
export function ContentTypeGuardFactory(contentType: ContentType) {
	ContentTypeGuard.setContentTypes(contentType);

	return ContentTypeGuard;
}
