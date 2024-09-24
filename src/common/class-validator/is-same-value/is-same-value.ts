/*
 * @Author: mulingyuer
 * @Date: 2024-09-24 16:09:30
 * @LastEditTime: 2024-09-24 16:12:44
 * @LastEditors: mulingyuer
 * @Description: 校验两个字段是否相同
 * @FilePath: \nestjs-prisma-template\src\common\class-validator\is-same-value\is-same-value.ts
 * 怎么可能会有bug！！！
 */

import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";

/**
 * @description: 校验两个字段是否相同
 * @param {string} property 字段名
 * @param {ValidationOptions} validationOptions
 * @Date: 2024-09-11 15:50:15
 * @Author: mulingyuer
 */
export function IsSameValue(property: string, validationOptions?: ValidationOptions) {
	return function (object: any, propertyName: string) {
		registerDecorator({
			name: "isSameValue",
			target: object.constructor,
			propertyName: propertyName,
			constraints: [property],
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					const [confirmKey] = args.constraints;
					const confirmValue = args.object[confirmKey];
					return confirmValue === value;
				}
			}
		});
	};
}
