/*
 * @Author: mulingyuer
 * @Date: 2024-07-02 11:18:42
 * @LastEditTime: 2025-04-16 15:38:47
 * @LastEditors: mulingyuer
 * @Description: 统一响应数据格式
 * @FilePath: \nest-demo\src\common\interceptors\response\response.interceptor.ts
 * 怎么可能会有bug！！！
 */
import {
	CallHandler,
	ExecutionContext,
	HttpStatus,
	Injectable,
	NestInterceptor
} from "@nestjs/common";
import { Observable, map } from "rxjs";
import { Result } from "@common/result-class/result";
import type { Request, Response } from "express";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest<Request>();
		const response = context.switchToHttp().getResponse<Response>();
		// 将post的状态码 201 => 200
		// eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
		const isPost = request.method === "POST" && response.statusCode === HttpStatus.CREATED;
		if (isPost) response.status(HttpStatus.OK);

		return next.handle().pipe(
			map((data) => {
				return Result.success(data);
			})
		);
	}
}
