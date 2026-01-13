/*
 * @Author: mulingyuer
 * @Date: 2024-07-01 16:56:56
 * @LastEditTime: 2026-01-13 16:39:02
 * @LastEditors: mulingyuer
 * @Description: 数据库填充
 * @FilePath: \nestjs-prisma-template\prisma\seed\index.ts
 * 怎么可能会有bug！！！
 */
import { PrismaClient } from "@generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { seedPermissions } from "./permissions";
import { seedRoles } from "./roles";
import { seedUsers } from "./users";

async function main() {
	const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
	const prisma = new PrismaClient({ adapter });
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
