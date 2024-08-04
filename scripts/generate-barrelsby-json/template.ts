/*
 * @Author: mulingyuer
 * @Date: 2024-07-25 11:44:24
 * @LastEditTime: 2024-07-25 12:30:14
 * @LastEditors: mulingyuer
 * @Description: 模板
 * @FilePath: \ease-change-backend\scripts\generate-barrelsby-json\template.ts
 * 怎么可能会有bug！！！
 */

interface Options {
	directory: string[];
	include: string[];
	exclude: string[];
}

export function template(options: Options) {
	return JSON.stringify(
		{
			directory: options.directory,
			exclude: options.exclude,
			include: options.include,
			location: "top",
			structure: "flat",
			noHeader: true
		},
		null,
		2
	);
}
