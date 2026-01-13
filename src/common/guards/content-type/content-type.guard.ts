/*
 * @Author: mulingyuer
 * @Date: 2024-07-04 09:29:58
 * @LastEditTime: 2026-01-13 16:55:09
 * @LastEditors: mulingyuer
 * @Description: content-type 校验
 * @FilePath: \nestjs-prisma-template\src\common\guards\content-type\content-type.guard.ts
 * 怎么可能会有bug！！！
 */
import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import type { ContentType } from "./types";
export type * from "./types";
import { IS_CONTENT_TYPE_KEY } from "@common/decorators";
import type { Request } from "express";
import { Reflector } from "@nestjs/core";

// 白名单 method
export const WHITE_LIST_METHODS = ["GET", "HEAD", "OPTIONS", "DELETE"];

@Injectable()
export class ContentTypeGuard implements CanActivate {
	private static defaultContentTypes: ContentType | null = null;

	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest<Request>();

		// 获取单独指定content-type
		const isContentType = this.reflector.getAllAndOverride<ContentType>(IS_CONTENT_TYPE_KEY, [
			context.getHandler(),
			context.getClass()
		]);
		if (isContentType === "none") return true;
		if (ContentTypeGuard.defaultContentTypes === "none") return true;

		// 获取元数据配置的 content-type 或使用默认值
		const requiredContentType = isContentType || ContentTypeGuard.defaultContentTypes;
		if (!requiredContentType) return true;

		// 幂等方法（无请求体的方法）直接放行，不校验 content-type
		if (WHITE_LIST_METHODS.includes(request.method)) return true;

		// 如果配置了requiredContentType，则必须检验Content-Type头
		// 不再依赖hasRequestBody来决定是否校验
		const contentType = request.headers["content-type"];
		if (!contentType) {
			throw new BadRequestException("头信息缺少content-type");
		}

		// 健壮的内容类型匹配
		if (!this.isContentTypeMatch(contentType, requiredContentType)) {
			throw new BadRequestException(`content-type 必须为 ${requiredContentType}`);
		}

		return true;
	}

	static setContentTypes(contentType: ContentType): void {
		ContentTypeGuard.defaultContentTypes = contentType;
	}

	/**
	 * 判断请求是否存在实际的请求体
	 * 通过以下任意条件判定：
	 * - Content-Length 大于 0
	 * - Transfer-Encoding 存在（流式上传）
	 * - req.body 非空对象
	 */
	private _hasRequestBody(request: Request): boolean {
		// 检查 Content-Length
		const contentLength = request.headers["content-length"];
		if (contentLength && Number(contentLength) > 0) {
			return true;
		}

		// 检查 Transfer-Encoding（分块传输编码）
		if (request.headers["transfer-encoding"]) {
			return true;
		}

		// 检查是否已被中间件解析（Nest/Express body-parser）
		if (request.body && typeof request.body === "object") {
			const bodyKeys = Object.keys(request.body);
			if (bodyKeys.length > 0) {
				return true;
			}
		}

		return false;
	}

	/**
	 * 内容类型匹配
	 * 支持：
	 * - application/json
	 * - application/json; charset=utf-8
	 * - application/problem+json
	 * - application/json-patch+json
	 * - multipart/form-data
	 * - multipart/form-data; boundary=...
	 * - application/x-www-form-urlencoded
	 */
	private isContentTypeMatch(contentType: string, requiredType: ContentType): boolean {
		// 提取主类型（分号前）
		const mainContentType = contentType.split(";")[0].trim().toLowerCase();
		const requiredMainType = String(requiredType).split(";")[0].trim().toLowerCase();

		// 完全匹配
		if (mainContentType === requiredMainType) {
			return true;
		}

		// JSON 族匹配（支持所有 +json 后缀）
		if (requiredMainType === "application/json") {
			const isJsonLike = /^application\/(.+\+)?json$/i.test(mainContentType);
			if (isJsonLike) {
				return true;
			}
		}

		// Multipart 族匹配
		if (requiredMainType.startsWith("multipart/")) {
			if (mainContentType.startsWith("multipart/")) {
				return true;
			}
		}

		// Form-URL-Encoded 族匹配
		if (requiredMainType === "application/x-www-form-urlencoded") {
			if (mainContentType === "application/x-www-form-urlencoded") {
				return true;
			}
		}

		return false;
	}
}

/** 守卫工厂 */
export function ContentTypeGuardFactory(contentType: ContentType) {
	ContentTypeGuard.setContentTypes(contentType);

	return ContentTypeGuard;
}
