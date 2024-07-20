/*
 * @Author: mulingyuer
 * @Date: 2024-07-02 15:54:11
 * @LastEditTime: 2024-07-21 01:39:48
 * @LastEditors: mulingyuer
 * @Description: jwt-auth 类型定义
 * @FilePath: \nestjs-prisma-template\src\common\guards\jwt-auth\types.ts
 * 怎么可能会有bug！！！
 */
import { User } from "@prisma/client";

/** token解析后的类型 */
export interface JwtPayload {
	/** 用户id */
	sub: number;
	iat: number;
	exp: number;
}

/** 用户数据类型 */
export type UserData = User;
