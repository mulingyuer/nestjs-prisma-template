/*
 * @Author: mulingyuer
 * @Date: 2024-07-02 11:47:12
 * @LastEditTime: 2024-09-24 16:18:58
 * @LastEditors: mulingyuer
 * @Description: 全局异常过滤器
 * @FilePath: \nestjs-prisma-template\src\common\filters\http-exception\http-exception.filter.ts
 * 怎么可能会有bug！！！
 */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import type { Request, Response } from "express";
import { Result } from "@common/result-class/result";
import { Prisma } from "@prisma/client";
import { CodeHttpException } from "@common/http-exception";
import { EnvEnum } from "@/common/enums";

const isDev = process.env[EnvEnum.NODE_ENV] === "development";
/** prisma的错误类 */
const PrismaErrorList = [
	Prisma.PrismaClientInitializationError,
	Prisma.PrismaClientKnownRequestError,
	Prisma.PrismaClientUnknownRequestError,
	Prisma.PrismaClientRustPanicError,
	Prisma.PrismaClientValidationError
];

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
				message = exception.toString();
			} else {
				message = "数据操作发生错误";
			}
		} else {
			message = exception?.toString();
		}

		// 返回
		response.status(status).json(Result.fail(code, message));
	}

	/** 是否是prisma报错 */
	private isPrismaError(exception: any): exception is (typeof PrismaErrorList)[number] {
		return PrismaErrorList.some((error) => exception instanceof error);
	}
}
