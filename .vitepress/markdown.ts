/*
 * @Author: mulingyuer
 * @Date: 2024-08-24 18:59:08
 * @LastEditTime: 2024-08-24 18:59:09
 * @LastEditors: mulingyuer
 * @Description: markdown配置
 * @FilePath: \nestjs-prisma-template\.vitepress\markdown.ts
 * 怎么可能会有bug！！！
 */
import type { MarkdownOptions } from "vitepress";

export const markdown: MarkdownOptions = {
  theme: {
    dark: "one-dark-pro",
    light: "one-light",
  },
  lineNumbers: true, // 代码块显示行号
  image: {
    lazyLoading: true, // 图片懒加载
  },
  toc: {
    level: [1, 2, 3, 4, 5, 6],
  },
};
