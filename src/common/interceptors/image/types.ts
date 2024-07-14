/*
 * @Author: mulingyuer
 * @Date: 2024-07-05 10:30:12
 * @LastEditTime: 2024-07-08 16:07:01
 * @LastEditors: mulingyuer
 * @Description: 图片校验拦截器类型
 * @FilePath: \ease-change-backend\src\common\interceptors\image\types.ts
 * 怎么可能会有bug！！！
 */
import {
	MulterField,
	MulterOptions
} from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

/** 单图片文件拦截器参数 */
export interface ImageInterceptorOptions {
	/** 表单字段名 */
	fieldName: string;
	/** 图片类型 */
	imageTypes: ImageTypeList;
	/** 图片大小限制，单位为字节 bytes */
	fileSize: number;
}

/** 图片文件数组拦截器参数 */
export interface ImageArrayInterceptorOptions {
	/** 表单字段名 */
	fieldName: string;
	/** 图片类型 */
	imageTypes: ImageTypeList;
	/** 图片大小限制，单位为字节 bytes */
	fileSize: number;
	/** 图片数量限制 */
	maxCount: number;
}

/** 多图片文件拦截器参数 */
export interface ImagesInterceptorOptions {
	fields: MulterField[];
	/** 图片类型 */
	imageTypes: ImageTypeList;
	/** 图片大小限制，单位为字节 bytes */
	fileSize: number;
}

/** 图片类型 */
export type ImageType = "jpg" | "jpeg" | "png";
export type ImageTypeList = Array<ImageType>;

/** 筛选函数 */
export type FilterFunction = MulterOptions["fileFilter"];
