/*
 * @Author: mulingyuer
 * @Date: 2024-09-24 15:48:27
 * @LastEditTime: 2025-04-16 16:42:10
 * @LastEditors: mulingyuer
 * @Description: 用户数据填充
 * @FilePath: \nest-demo\prisma\seed\users.ts
 * 怎么可能会有bug！！！
 */
import { EnvEnum } from "@/common/enums";
import { Prisma, PrismaClient } from "@prisma-client";
import { hash } from "@node-rs/argon2";

export async function seedUsers(prisma: PrismaClient) {
	// 获取用户角色
	const role = await prisma.role.findUnique({ where: { id: 1 } });
	if (!role) throw new Error("管理员角色不存在");

	// 创建管理员
	const account = process.env[EnvEnum.ADMIN_ACCOUNT];
	const password = process.env[EnvEnum.ADMIN_PASSWORD];
	if (!account || !password) throw new Error("管理员账号或密码未设置");
	const data: Prisma.UserCreateInput = {
		nickname: "管理员",
		account,
		password: await hash(password, { timeCost: Number(process.env[EnvEnum.HASH_SALT_OR_ROUNDS]) }),
		roleIds: [role.id]
	};
	await prisma.user.upsert({
		where: { account: data.account },
		update: data,
		create: data
	});

	console.log("用户数据填充完成");
}
