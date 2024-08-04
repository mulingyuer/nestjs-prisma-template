/*
 * @Author: mulingyuer
 * @Date: 2024-08-04 10:08:13
 * @LastEditTime: 2024-08-04 10:08:43
 * @LastEditors: mulingyuer
 * @Description: 生成barrelsby.json文件
 * @FilePath: \nestjs-prisma-template\scripts\generate-barrelsby-json\index.ts
 * 怎么可能会有bug！！！
 */

import { readdirSync, statSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { template } from "./template";

/** 项目目录 */
const baseDir = join(__dirname, "../../src");
/** 过滤 */
const exclude = ["node_modules", "test", ".spec.ts", "types.ts"];
/** 包含 */
const include = [".ts"];
/** json文件保存路径 */
const jsonFilePath = join(__dirname, "../../");
/** json文件名 */
const jsonFileName = "barrelsby.json";

function main() {
	/** 需要获取子级目录的目录数组 */
	const directoryList: string[] = [];
	directoryList.push(...getModulesChildDirs());
	directoryList.push(...getCommonChildDirs());
	// 通过模板生成json文件
	const jsonContent = template({
		directory: directoryList,
		exclude: exclude,
		include: include
	});
	// 写入
	writeFileSync(join(jsonFilePath, jsonFileName), jsonContent, "utf-8");
}
main();

/** 获取modules下的子级目录 */
function getModulesChildDirs() {
	const modulesDir = join(baseDir, "modules");
	return getParentDirs(modulesDir, [".dto.ts", ".entity.ts"]);
}

/** 获取common下的子级目录 */
function getCommonChildDirs() {
	const commonDir = join(baseDir, "common");
	return getSubdirectoriesFromArray([commonDir]);
}

/** 获取指定条件的父级目录 */
function getParentDirs(baseDir: string, extensions: string[]) {
	const parentDirs = new Set<string>();

	function findFilesInDir(currentDir) {
		const files = readdirSync(currentDir);

		files.forEach((file) => {
			const filePath = join(currentDir, file);
			const stat = statSync(filePath);

			if (stat.isDirectory()) {
				findFilesInDir(filePath); // 递归进入子目录
			} else {
				// 检查文件扩展名是否在提供的数组中
				for (const ext of extensions) {
					if (file.endsWith(ext)) {
						parentDirs.add(dirname(filePath)); // 存储父级目录
						break; // 找到一个匹配的扩展名后跳出循环
					}
				}
			}
		});
	}

	findFilesInDir(baseDir);

	return Array.from(parentDirs); // 返回父级目录集合
}

// 获取单个目录的子级目录
function getSubdirectories(dir: string) {
	try {
		const files = readdirSync(dir, { withFileTypes: true });
		// 过滤出目录
		const subDirs = files.filter((file) => file.isDirectory()).map((file) => join(dir, file.name));
		return subDirs;
	} catch (err) {
		console.error(`Error reading directory ${dir}:`, err);
		return []; // 如果发生错误，返回空数组
	}
}

// 获取多个目录的子级目录（同步）
function getSubdirectoriesFromArray(dirs: string[]) {
	const dirList: string[] = [];
	for (const dir of dirs) {
		const subDirs = getSubdirectories(dir);
		dirList.push(...subDirs);
	}
	return dirList;
}
