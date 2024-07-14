/*
 * @Author: mulingyuer
 * @Date: 2024-07-02 15:54:11
 * @LastEditTime: 2024-07-02 15:55:25
 * @LastEditors: mulingyuer
 * @Description: jwt-auth 类型定义
 * @FilePath: \ease-change-backend\src\common\guards\jwt-auth\types.ts
 * 怎么可能会有bug！！！
 */

/** token解析后的类型 */
export interface JwtPayload {
	/** 用户id */
	sub: number;
	iat: number;
	exp: number;
}
