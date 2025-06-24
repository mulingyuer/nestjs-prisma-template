/*
 * @Author: mulingyuer
 * @Date: 2024-09-24 16:21:06
 * @LastEditTime: 2025-04-16 16:42:18
 * @LastEditors: mulingyuer
 * @Description: 鉴权相关类型
 * @FilePath: \nest-demo\src\common\types\auth\auth.types.ts
 * 怎么可能会有bug！！！
 */
import { PermissionEnum, Role, User, RoleNameEnum, Permission } from "@prisma/generated/client";

/** 数据库的用户类型 */
export type DbUser = Omit<User, "roleIds"> & { roleIds: number[] };

/** 数据库的角色类型 */
export type DbRole = Omit<Role, "permissionIds"> & { permissionIds: number[] };
export type DbRoles = DbRole[];

/** 数据库的权限类型 */
export type DbPermission = Permission;
export type DbPermissions = DbPermission[];

/** 角色名称 */
export type Roles = RoleNameEnum[];

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
	/** 生成时间 s */
	iat: number;
	/** 过期时间 s */
	exp: number;
}
