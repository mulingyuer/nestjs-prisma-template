/*
 * @Author: mulingyuer
 * @Date: 2024-09-24 15:37:27
 * @LastEditTime: 2026-01-13 16:39:14
 * @LastEditors: mulingyuer
 * @Description: 生成权限表
 * @FilePath: \nestjs-prisma-template\prisma\seed\permissions.ts
 * 怎么可能会有bug！！！
 */
import { PrismaClient, PermissionEnum, Prisma } from "@generated/prisma/client";

export async function seedPermissions(prisma: PrismaClient) {
	// 权限列表 （都是测试数据，请根据自己实际情况修改）
	const list: Prisma.PermissionCreateInput[] = [
		{ id: 1, name: PermissionEnum.CREATE, desc: "新增" },
		{ id: 2, name: PermissionEnum.DELETE, desc: "删除" },
		{ id: 3, name: PermissionEnum.READ, desc: "查看" },
		{ id: 4, name: PermissionEnum.UPDATE, desc: "修改" }
	];

	// 创建权限
	await prisma.$transaction(async (prisma) => {
		for (const item of list) {
			await prisma.permission.upsert({
				where: { id: item.id },
				update: item,
				create: item
			});
		}
	});

	console.log("权限创建完成");
}
