/*
 * @Author: mulingyuer
 * @Date: 2024-07-02 16:08:34
 * @LastEditTime: 2024-07-14 21:37:32
 * @LastEditors: mulingyuer
 * @Description: user装饰器类型
 * @FilePath: \nestjs-prisma-template\src\common\decorators\user\types.ts
 * 怎么可能会有bug！！！
 */
import { Prisma } from "@prisma/client";

const userInfoParams = Prisma.validator<Prisma.UserFindUniqueArgs>()({
	where: {
		id: 1 // 这里只是一个占位符，可以是任意有效值
	},
	// NOTE: 目前数据太单调，所以配了select，如果查询条件够多，select可以不用写
	// 			这样就不会报ts类型错误
	select: {
		id: true,
		nickname: true,
		avatarUrl: true
	}
});

/** 用户数据类型 */
export type UserData = Prisma.UserGetPayload<typeof userInfoParams>;
