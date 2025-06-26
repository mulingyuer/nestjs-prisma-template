/*
 * @Author: mulingyuer
 * @Date: 2025-06-26 11:15:53
 * @LastEditTime: 2025-06-26 11:15:53
 * @LastEditors: mulingyuer
 * @Description: 全局工具类型定义
 * @FilePath: \nestjs-prisma-template\types\type-utils.d.ts
 * 怎么可能会有bug！！！
 */

/** 将类型转换为可读性更好的类型 */
type Prettify<T> = {
	[K in keyof T]: T[K];
};

/** 将对象属性增加前缀 */
type AddPrefix<Prefix extends string, T> = {
	[K in keyof T as `${Prefix}${Extract<K, string>}`]: T[K];
};
