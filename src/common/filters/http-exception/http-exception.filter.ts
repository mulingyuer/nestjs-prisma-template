/*
 * @Author: mulingyuer
 * @Date: 2024-07-02 11:47:12
 * @LastEditTime: 2026-01-13 16:52:42
 * @LastEditors: mulingyuer
 * @Description: 全局异常过滤器
 * @FilePath: \nestjs-prisma-template\src\common\filters\http-exception\http-exception.filter.ts
 * 怎么可能会有bug！！！
 */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import type { Request, Response } from "express";
import { Result } from "@common/result-class/result";
import { CodeHttpException } from "@common/http-exception";
import { EnvEnum } from "@/common/enums";

const isDev = process.env[EnvEnum.NODE_ENV] === "development";

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
	catch(exception: T, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const _request = ctx.getRequest<Request>();
		const isHttpException = exception instanceof HttpException;

		// 状态码
		const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
		const code = exception instanceof CodeHttpException ? exception.code : status;
		// 错误信息
		let message = "";
		if (isHttpException) {
			message = exception.message ?? "Internal Server Error";
			// 文件大小超出限制
			if (message.includes("File too large")) {
				message = "文件大小超出限制";
			}
		} else if (this.isPrismaError(exception)) {
			if (isDev) {
				message = (exception as any).toString();
			} else {
				message = "数据操作发生错误";
			}
		} else {
			message = exception?.toString() ?? "Internal Server Error";
		}

		// 返回
		response.status(status).json(Result.fail(code, message));
	}

	/** 是否是prisma报错 */
	private isPrismaError(exception: any): { isPrisma: boolean; type?: string } {
		if (!("clientVersion" in exception)) {
			return { isPrisma: false };
		}

		if (exception.code) return { isPrisma: true, type: "KnownRequestError" };
		if (exception.retryable !== undefined) return { isPrisma: true, type: "InitializationError" };
		if (exception.name === "PrismaClientValidationError")
			return { isPrisma: true, type: "ValidationError" };
		if (exception.batchRequestIdx !== undefined)
			return { isPrisma: true, type: "UnknownRequestError" };

		return { isPrisma: true, type: "Other" };
	}
}
