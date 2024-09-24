/*
 * @Author: mulingyuer
 * @Date: 2024-07-01 16:56:56
 * @LastEditTime: 2024-09-24 16:03:05
 * @LastEditors: mulingyuer
 * @Description: 数据库填充
 * @FilePath: \nestjs-prisma-template\prisma\seed\index.ts
 * 怎么可能会有bug！！！
 */
import { seedPermissions } from "./permissions";
import { seedRoles } from "./roles";
import { seedUsers } from "./users";

async function main() {
	// 填充权限
	await seedPermissions();
	// 填充角色
	await seedRoles();
	// 填充用户
	await seedUsers();

	console.log("数据填充完成");
}

main();
