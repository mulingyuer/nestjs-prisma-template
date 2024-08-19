/*
 * @Author: mulingyuer
 * @Date: 2024-08-19 16:52:43
 * @LastEditTime: 2024-08-19 16:53:00
 * @LastEditors: mulingyuer
 * @Description: 自定义code错误类
 * @FilePath: \nestjs-prisma-template\src\common\http-exception\code-http-exception.ts
 * 怎么可能会有bug！！！
 */
import { HttpException, HttpStatus } from "@nestjs/common";

export class CodeHttpException extends HttpException {
	/** 自定义code */
	code: number;

	constructor(code: number, status: HttpStatus, message: string) {
		super(message, status);
		this.code = code;
	}
}
