/*
 * @Author: mulingyuer
 * @Date: 2024-07-01 16:56:56
 * @LastEditTime: 2024-07-21 01:37:27
 * @LastEditors: mulingyuer
 * @Description: 数据库填充
 * @FilePath: \nestjs-prisma-template\prisma\seed\index.ts
 * 怎么可能会有bug！！！
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	// 创建一个测试用户
	await prisma.user.create({
		data: {
			nickname: "test"
		}
	});

	console.log("数据填充完成");
}

main();
