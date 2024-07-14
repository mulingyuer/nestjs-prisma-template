/*
 * @Author: mulingyuer
 * @Date: 2024-07-04 09:31:23
 * @LastEditTime: 2024-07-04 10:25:48
 * @LastEditors: mulingyuer
 * @Description: content-type 校验类型
 * @FilePath: \ease-change-backend\src\common\guards\content-type\types.ts
 * 怎么可能会有bug！！！
 */

export type ContentType =
	| "application/json"
	| "application/x-www-form-urlencoded"
	| "multipart/form-data"
	| "none"; // 不需要校验
