import { defineConfig } from "vitepress";
import { markdown } from "./markdown";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "NestJS + Prisma 模板",
	description:
		"基于官方文档的封装，一切以简洁易阅读为宗旨，不存在复杂封装，有利于项目快速上手开发，对于复杂需求可以自行定制，有兴趣的也可以分享对应教程，大家一同学习进步。",
	base: "/nestjs-prisma-template",
	outDir: "docs",
	srcDir: "src",
	cleanUrls: true,
	head: [["link", { rel: "icon", href: "/nestjs-prisma-template/logo.png" }]],
	themeConfig: {
		logo: "/logo.png",
		search: {
			provider: "local",
			options: {
				locales: {
					"/": {
						translations: {
							button: {
								buttonText: "搜索文档",
								buttonAriaLabel: "搜索文档"
							},
							modal: {
								noResultsText: "无法找到相关结果",
								resetButtonTitle: "清除查询条件",
								footer: {
									selectText: "选择",
									navigateText: "切换"
								}
							}
						}
					}
				}
			}
		},
		docFooter: {
			prev: "上一页",
			next: "下一页"
		},
		outline: {
			level: "deep",
			label: "目录树"
		},
		socialLinks: [
			{
				icon: "github",
				link: "https://github.com/mulingyuer/nestjs-prisma-template"
			}
		],
		nav: [
			{ text: "首页", link: "/" },
			{ text: "文档", link: "/introduction/what-is" }
		],
		sidebar: [
			{
				text: "简介",
				collapsed: false,
				items: [
					{ text: "项目介绍", link: "/introduction/what-is" },
					{ text: "快速开始", link: "/introduction/started" },
					{ text: "打包部署", link: "/introduction/deploy" }
				]
			},
			{
				text: "核心功能",
				collapsed: false,
				items: [
					{ text: "错误异常处理", link: "/core-features/error-handling" },
					{ text: "接口响应格式", link: "/core-features/response-format" },
					{ text: "日志管理", link: "/core-features/logger" },
					{ text: "Swagger文档", link: "/core-features/swagger" }
				]
			}
		]
	},
	markdown
});
