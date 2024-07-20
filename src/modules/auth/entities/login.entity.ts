/*
 * @Author: mulingyuer
 * @Date: 2024-07-21 01:48:31
 * @LastEditTime: 2024-07-21 01:49:32
 * @LastEditors: mulingyuer
 * @Description: 登录实体
 * @FilePath: \nestjs-prisma-template\src\modules\auth\entities\login.entity.ts
 * 怎么可能会有bug！！！
 */

export class LoginEntity {
	access_token: string;

	constructor(token: string) {
		this.access_token = token;
	}
}
