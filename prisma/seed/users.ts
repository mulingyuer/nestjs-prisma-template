/*
 * @Author: mulingyuer
 * @Date: 2024-09-24 15:48:27
 * @LastEditTime: 2024-09-24 16:01:51
 * @LastEditors: mulingyuer
 * @Description: 用户数据填充
 * @FilePath: \nestjs-prisma-template\prisma\seed\users.ts
 * 怎么可能会有bug！！！
 */
import { EnvEnum } from "@/common/enums";
import { Prisma, PrismaClient, RoleNameEnum } from "@prisma/client";
import { hash } from "bcrypt";

export async function seedUsers() {
	const prisma = new PrismaClient();

	// 获取用户角色
	const role = await prisma.role.findUnique({ where: { name: RoleNameEnum.ADMIN } });
	if (!role) throw new Error("管理员角色不存在");

	// 创建管理员
	const data: Prisma.UserCreateInput = {
		nickname: "管理员",
		account: "admin",
		password: await hash("admin", Number(process.env[EnvEnum.HASH_SALT_OR_ROUNDS])),
		roleIds: [role.id]
	};
	await prisma.user.upsert({
		where: { account: data.account },
		update: data,
		create: data
	});

	console.log("用户数据填充完成");
}
