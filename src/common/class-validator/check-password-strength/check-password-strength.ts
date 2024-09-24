/*
 * @Author: mulingyuer
 * @Date: 2024-09-24 16:09:30
 * @LastEditTime: 2024-09-24 16:12:29
 * @LastEditors: mulingyuer
 * @Description: 检测密码强度
 * @FilePath: \nestjs-prisma-template\src\common\class-validator\check-password-strength\check-password-strength.ts
 * 怎么可能会有bug！！！
 */

import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";
import { checkPasswordStrength } from "@/utils/password-tools";

/**
 * @description: 检测密码强度
 * @param {number} lowestScore 表示最低破解该密码的预期猜测次数的对数，推荐值为4
 * @param {ValidationOptions} validationOptions
 * @Date: 2024-09-11 15:50:50
 * @Author: mulingyuer
 */
export function CheckPasswordStrength(lowestScore: number, validationOptions?: ValidationOptions) {
	return function (object: any, propertyName: string) {
		registerDecorator({
			name: "CheckPasswordStrength",
			target: object.constructor,
			propertyName: propertyName,
			constraints: [lowestScore],
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					if (typeof value !== "string") value = value.toString();
					const [lowestScore] = args.constraints;
					return checkPasswordStrength(value, lowestScore);
				}
			}
		});
	};
}
