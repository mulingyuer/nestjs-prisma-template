/*
 * @Author: mulingyuer
 * @Date: 2024-07-11 15:49:15
 * @LastEditTime: 2024-08-19 17:07:36
 * @LastEditors: mulingyuer
 * @Description: 自定义错误类
 * @FilePath: \nestjs-prisma-template\src\shared\custom-http-exception\index.ts
 * 怎么可能会有bug！！！
 */

import { HttpException, HttpStatus } from "@nestjs/common";
import { CodeHttpException } from "@common/http-exception";

/** 第三方服务报错 */
export class ThirdPartyServiceException extends HttpException {
	constructor(message: string) {
		super(message, HttpStatus.BAD_GATEWAY);
	}
}

/** 自定义code错误，测试示例 */
export class CustomCodeException extends CodeHttpException {
	constructor(message: string = "自定义code错误") {
		super(99999, HttpStatus.BAD_REQUEST, message);
	}
}
