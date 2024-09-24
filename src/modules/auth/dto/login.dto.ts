/*
 * @Author: mulingyuer
 * @Date: 2024-09-24 16:37:01
 * @LastEditTime: 2024-09-24 16:37:02
 * @LastEditors: mulingyuer
 * @Description: 登录dto
 * @FilePath: \nestjs-prisma-template\src\modules\auth\dto\login.dto.ts
 * 怎么可能会有bug！！！
 */

import { CheckPasswordStrength } from "@/common/class-validator";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class LoginDto {
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
}
