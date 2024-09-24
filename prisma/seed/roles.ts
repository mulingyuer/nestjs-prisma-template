/*
 * @Author: mulingyuer
 * @Date: 2024-09-24 15:44:42
 * @LastEditTime: 2024-09-24 15:44:43
 * @LastEditors: mulingyuer
 * @Description: 角色填充
 * @FilePath: \nestjs-prisma-template\prisma\seed\roles.ts
 * 怎么可能会有bug！！！
 */
import { PrismaClient, Prisma, RoleNameEnum, PermissionEnum } from "@prisma/client";

export async function seedRoles() {
	const prisma = new PrismaClient();

	// 查询权限
	const permissions = await prisma.permission.findMany();
	const permissionMap = new Map(permissions.map((item) => [item.name, item.id]));

	// 不同角色的权限 （都是测试数据，请根据自己实际情况修改）
	const rolePermissions: Record<RoleNameEnum, PermissionEnum[]> = {
		[RoleNameEnum.USER]: [
			PermissionEnum.CREATE,
			PermissionEnum.DELETE,
			PermissionEnum.READ,
			PermissionEnum.UPDATE
		],
		[RoleNameEnum.ADMIN]: [
			PermissionEnum.CREATE,
			PermissionEnum.DELETE,
			PermissionEnum.READ,
			PermissionEnum.UPDATE
		]
	};

	/** 根据传入的角色获取权限id */
	function getPermissionIds(role: RoleNameEnum) {
		return rolePermissions[role]
			.map((permission) => permissionMap.get(permission))
			.filter((item) => typeof item === "number");
	}

	const roles: Prisma.RoleCreateInput[] = [
		{
			name: RoleNameEnum.USER,
			desc: "普通用户",
			permissionIds: getPermissionIds(RoleNameEnum.USER)
		},
		{
			name: RoleNameEnum.ADMIN,
			desc: "管理员",
			permissionIds: getPermissionIds(RoleNameEnum.ADMIN)
		}
	];

	// 创建角色
	await prisma.$transaction(async (prisma) => {
		for (const role of roles) {
			await prisma.role.upsert({
				where: { name: role.name },
				create: role,
				update: role
			});
		}
	});

	console.log("角色创建完成");
}
