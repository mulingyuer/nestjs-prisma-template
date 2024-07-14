/*
 * @Author: mulingyuer
 * @Date: 2024-07-11 15:49:15
 * @LastEditTime: 2024-07-11 15:49:16
 * @LastEditors: mulingyuer
 * @Description: 自定义错误类
 * @FilePath: \ease-change-backend\src\shared\custom-http-exception\index.ts
 * 怎么可能会有bug！！！
 */

import { HttpException, HttpStatus } from "@nestjs/common";

/** 第三方服务报错 */
export class ThirdPartyServiceException extends HttpException {
	constructor(message: string) {
		super(message, HttpStatus.BAD_GATEWAY);
	}
}
