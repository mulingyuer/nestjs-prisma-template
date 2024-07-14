/*
 * @Author: mulingyuer
 * @Date: 2024-07-02 11:25:23
 * @LastEditTime: 2024-07-05 14:17:09
 * @LastEditors: mulingyuer
 * @Description: 响应结果类
 * @FilePath: \ease-change-backend\src\common\result-class\result.ts
 * 怎么可能会有bug！！！
 */
import { HttpStatus } from "@nestjs/common";
import { isObject } from "@utils/tools";

export class Result {
	private data: any;
	private message: string;
	private code: number;

	static readonly keys = ["data", "message", "code"];

	constructor(data: any, message: string, code: number) {
		this.data = data ?? null;
		this.message = message;
		this.code = code;
	}

	/** 成功 */
	static success(data: any): Result {
		if (data instanceof Result) return data;
		// 检查data是否包含Result类的所有键
		if (isObject(data)) {
			const isKeys = Object.keys(data).every((key) => Result.keys.includes(key));
			if (isKeys) return data;
		}
		return new Result(data, "成功", 200);
	}

	/** 失败 */
	static fail(
		code: number = HttpStatus.BAD_REQUEST,
		message: string = "失败",
		data: any = null
	): Result {
		return new Result(data, message, code);
	}
}
