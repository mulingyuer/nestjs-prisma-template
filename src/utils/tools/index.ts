/*
 * @Author: mulingyuer
 * @Date: 2024-07-02 14:48:53
 * @LastEditTime: 2024-08-04 10:25:21
 * @LastEditors: mulingyuer
 * @Description: 工具
 * @FilePath: \nestjs-prisma-template\src\utils\tools\index.ts
 * 怎么可能会有bug！！！
 */
import { dirname, join } from "path";
import { ConfigService } from "@nestjs/config";
import { InternalServerErrorException } from "@nestjs/common";

/** 是否是一个对象 { key: value} */
export function isObject(variable) {
	return Object.prototype.toString.call(variable) === "[object Object]";
}

/** 获取日志时间（中国时间）：2024-07-04T12:33:05 */
export const getLogTime = (() => {
	// 使用toLocaleString方法并指定时区为中国时区
	const formatter = new Intl.DateTimeFormat("zh-CN", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		timeZone: "Asia/Shanghai",
		hour12: false
	});

	return function getLogTime() {
		const date = new Date();
		const [
			{ value: year },
			,
			{ value: month },
			,
			{ value: day },
			,
			{ value: hour },
			,
			{ value: minute },
			,
			{ value: second }
		] = formatter.formatToParts(date);

		return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
	};
})();

/** 获取项目根路径 */
export function getRootPath() {
	const mainPath = dirname(require.main.filename);
	return mainPath.split("dist")[0];
}

/** 项目根路径拼接 */
export function joinRootPath(...paths: string[]) {
	return join(getRootPath(), ...paths);
}

/** bytes单位转换，低于1gb转mb，大于转gb，1000gb转t */
export function bytesToUnit(bytes: number) {
	const units = ["MB", "GB", "TB"];
	const thresholds = [1024 ** 2, 1024 ** 3, 1024 ** 4];

	for (let i = 0; i < thresholds.length; i++) {
		if (bytes < thresholds[i]) {
			return `${(bytes / thresholds[i - 1]).toFixed(2)} ${units[i - 1]}`;
		}
	}
	return `${(bytes / thresholds[2]).toFixed(2)} ${units[2]}`;
}

/** 链接拼接，仅路径/处理 */
export function joinUrl(...paths: string[]): string {
	return paths.reduce((prev, curr) => {
		if (typeof prev === "string" && prev === "") {
			// 第一次
			if (curr.startsWith("http")) {
				return curr.replace(/\/+$/, "");
			}
			return `/${curr.replace(/^\/+/, "")}`;
		}
		return `${prev.replace(/\/+$/, "")}/${curr.replace(/^\/+/, "")}`;
	}, "");
}

/** 判断环境变量是否缺少 */
export function checkEnv(configService: ConfigService, env: string[]): boolean {
	const missingEnvVars = env.filter((key) => typeof configService.get(key) === "undefined");
	if (missingEnvVars.length) {
		throw new InternalServerErrorException(`缺失环境配置：${missingEnvVars.join(", ")}`);
	}
	return true;
}
