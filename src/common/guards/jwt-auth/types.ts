/*
 * @Author: mulingyuer
 * @Date: 2024-07-02 15:54:11
 * @LastEditTime: 2025-04-16 16:42:14
 * @LastEditors: mulingyuer
 * @Description: jwt-auth 类型定义
 * @FilePath: \nest-demo\src\common\guards\jwt-auth\types.ts
 * 怎么可能会有bug！！！
 */
import { DbUser, Permissions } from "@/common/types";
import { RoleNameEnum } from "@prisma-client";

/** 上下文中的用户数据类型 */
export type UserData = DbUser & {
	roles: RoleNameEnum[];
	permissions: Permissions;
};
