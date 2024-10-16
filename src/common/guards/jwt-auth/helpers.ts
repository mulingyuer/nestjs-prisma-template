/*
 * @Author: mulingyuer
 * @Date: 2024-10-16 09:16:18
 * @LastEditTime: 2024-10-16 09:20:33
 * @LastEditors: mulingyuer
 * @Description: jwt-auth的helpers
 * @FilePath: \nestjs-prisma-template\src\common\guards\jwt-auth\helpers.ts
 * 怎么可能会有bug！！！
 */
import { DbPermissions, DbRoles, DbUser, JwtPayload, Permissions, Roles } from "@/common/types";
import { PrismaService } from "@/shared/prisma/prisma.service";
import { UserData } from "./types";

/** 通过id获取用户数据 */
export async function getUser(id: number, prismaService: PrismaService): Promise<DbUser | null> {
	const findUser = await prismaService.user.findUnique({
		where: { id }
	});

	if (!findUser) return null;
	return findUser as DbUser;
}

/** 查询用户角色 */
export async function findRoles(
	roleIds: Array<number>,
	prismaService: PrismaService
): Promise<{ origin: DbRoles; roles: Roles }> {
	const roles = await prismaService.role.findMany({
		where: { id: { in: roleIds } }
	});

	return {
		origin: roles as DbRoles,
		roles: roles.map((item) => item.name)
	};
}

/** 查询用户角色权限 */
export async function findPermissions(
	roles: DbRoles,
	prismaService: PrismaService
): Promise<{ origin: DbPermissions; permissions: Permissions }> {
	const permissionIds = [...new Set<number>(roles.flatMap((role) => role.permissionIds))];

	const findPermissions = await prismaService.permission.findMany({
		where: { id: { in: permissionIds } }
	});

	return {
		origin: findPermissions,
		permissions: findPermissions.map((item) => item.name)
	};
}

/** 从jwt中获取用户信息 */
export async function getUserFromJwt(
	jwtPayload: JwtPayload,
	prismaService: PrismaService
): Promise<UserData | null> {
	// 查询角色
	const user = await getUser(jwtPayload.sub, prismaService);
	if (!user) return null;

	return {
		...user,
		roles: jwtPayload.roles,
		permissions: jwtPayload.permissions
	};
}

/** 通过用户id获取用户信息 */
export async function getUserFromId(
	id: number,
	prismaService: PrismaService
): Promise<UserData | null> {
	const user = await getUser(id, prismaService);
	if (!user) return null;

	// 查询用户角色
	const roleData = await findRoles(user.roleIds, prismaService);

	// 查询用户权限
	const permissionData = await findPermissions(roleData.origin, prismaService);

	return {
		...user,
		roles: roleData.roles,
		permissions: permissionData.permissions
	};
}
