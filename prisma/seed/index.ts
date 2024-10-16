/*
 * @Author: mulingyuer
 * @Date: 2024-07-01 16:56:56
 * @LastEditTime: 2024-10-16 11:08:25
 * @LastEditors: mulingyuer
 * @Description: 数据库填充
 * @FilePath: \nestjs-prisma-template\prisma\seed\index.ts
 * 怎么可能会有bug！！！
 */
import { PrismaClient } from "@prisma/client";
import { seedPermissions } from "./permissions";
import { seedRoles } from "./roles";
import { seedUsers } from "./users";

async function main() {
	const prisma = new PrismaClient();
	// 填充权限
	await seedPermissions(prisma);
	// 填充角色
	await seedRoles(prisma);
	// 填充用户
	await seedUsers(prisma);

	// 关闭数据库连接
	await prisma.$disconnect();

	console.log("数据填充完成");
}

main();
