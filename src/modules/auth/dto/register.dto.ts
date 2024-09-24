/*
 * @Author: mulingyuer
 * @Date: 2024-09-24 16:37:01
 * @LastEditTime: 2024-09-24 16:37:12
 * @LastEditors: mulingyuer
 * @Description: 注册账号dto
 * @FilePath: \nestjs-prisma-template\src\modules\auth\dto\register.dto.ts
 * 怎么可能会有bug！！！
 */

import { IsSameValue, CheckPasswordStrength } from "@/common/class-validator";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class RegisterDto {
	/** 昵称 */
	@Length(2, 20, { message: "昵称长度必须在2-30之间" })
	@IsString({ message: "昵称必须为字符串" })
	@IsNotEmpty({ message: "昵称不能为空" })
	nickname: string;

	/** 账号 */
	@Length(5, 20, { message: "账号长度必须在5-50之间" })
	@IsString({ message: "账号必须为字符串" })
	@IsNotEmpty({ message: "账号不能为空" })
	account: string;

	/** 密码 */
	@CheckPasswordStrength(4, { message: "密码强度不够" })
	@Length(8, 30, { message: "密码长度必须在8-30之间" })
	@IsString({ message: "密码必须为字符串" })
	@IsNotEmpty({ message: "密码不能为空" })
	password: string;

	/** 二次验证密码 */
	@IsSameValue("password", { message: "两次输入的密码不一致" })
	@IsNotEmpty({ message: "请输入确认密码" })
	confirm_password: string;
}
