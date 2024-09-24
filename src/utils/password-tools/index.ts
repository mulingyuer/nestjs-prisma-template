/*
 * @Author: mulingyuer
 * @Date: 2024-09-11 15:32:42
 * @LastEditTime: 2024-09-24 16:14:14
 * @LastEditors: mulingyuer
 * @Description: 密码处理工具
 * @FilePath: \nestjs-prisma-template\src\utils\password-tools\index.ts
 * 怎么可能会有bug！！！
 */
import * as zxcvbn from "zxcvbn";

/**
 * @description: 校验密码强度
 * @param {string} password 密码
 * @param {*} lowestScore 最低密码强度分数
 * @Date: 2024-09-11 15:43:07
 * @Author: mulingyuer
 */
export function checkPasswordStrength(password: string, lowestScore = 4): boolean {
	const { guesses_log10 } = zxcvbn(password);
	if (guesses_log10 < lowestScore) return false;
	return true;
}
