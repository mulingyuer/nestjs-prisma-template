/*
 * @Author: mulingyuer
 * @Date: 2024-07-21 01:48:31
 * @LastEditTime: 2024-09-24 16:37:40
 * @LastEditors: mulingyuer
 * @Description: 登录实体
 * @FilePath: \nestjs-prisma-template\src\modules\auth\entities\login.entity.ts
 * 怎么可能会有bug！！！
 */

export interface LoginEntityData {
	/** token */
	access_token: string;
	/** 过期时间 ms */
	expiration: number;
}

export class LoginEntity {
	/** token */
	access_token: string;

	/** 过期时间 ms */
	expiration: number;

	constructor(data: LoginEntityData) {
		Object.assign(this, data);
	}
}
