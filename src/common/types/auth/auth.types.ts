/*
 * @Author: mulingyuer
 * @Date: 2024-09-24 16:21:06
 * @LastEditTime: 2024-09-24 16:21:12
 * @LastEditors: mulingyuer
 * @Description: 鉴权相关类型
 * @FilePath: \nestjs-prisma-template\src\common\types\auth\auth.types.ts
 * 怎么可能会有bug！！！
 */
import { PermissionEnum, Role, User, RoleNameEnum } from "@prisma/client";

/** 数据库的用户类型 */
export type DbUser = Omit<User, "roleIds"> & { roleIds: number[] };

/** 数据库的角色类型 */
export type DbRole = Omit<Role, "permissionIds"> & { permissionIds: number[] };
export type DbRoles = DbRole[];

/** 角色权限类型 */
export type Permissions = PermissionEnum[];

/** 生成token参数 */
export interface GenerateTokenData {
	user: DbUser;
	roles: DbRoles;
	permissions: Permissions;
}

/** token解析后的类型 */
export interface JwtPayload {
	/** 用户id */
	sub: number;
	/** 用户昵称 */
	nickname: string;
	/** 角色数组 */
	roles: RoleNameEnum[];
	/** 权限数组 */
	permissions: Permissions;
	/** 生成时间 */
	iat: 1726215641;
	/** 过期时间 */
	exp: 1726820441;
}
