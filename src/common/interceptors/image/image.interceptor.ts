/*
 * @Author: mulingyuer
 * @Date: 2024-07-05 09:53:44
 * @LastEditTime: 2024-07-08 16:08:20
 * @LastEditors: mulingyuer
 * @Description: 图片校验拦截器
 * @FilePath: \ease-change-backend\src\common\interceptors\image\image.interceptor.ts
 * 怎么可能会有bug！！！
 */
import { BadRequestException, NestInterceptor, Type } from "@nestjs/common";
import { FileInterceptor, FileFieldsInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import type {
	ImageInterceptorOptions,
	ImagesInterceptorOptions,
	FilterFunction,
	ImageTypeList,
	ImageArrayInterceptorOptions
} from "./types";
export type * from "./types";

/** 单图片文件拦截器 */
export function ImageInterceptor(options: ImageInterceptorOptions): Type<NestInterceptor> {
	const { fieldName, fileSize, imageTypes } = options;
	return FileInterceptor(fieldName, {
		limits: {
			fileSize: fileSize
		},
		fileFilter: imageFileFilter(imageTypes)
	});
}

/** 图片文件数组拦截器 */
export function ImageArrayInterceptor(
	options: ImageArrayInterceptorOptions
): Type<NestInterceptor> {
	const { fieldName, fileSize, imageTypes, maxCount } = options;
	return FilesInterceptor(fieldName, maxCount, {
		limits: {
			fileSize: fileSize
		},
		fileFilter: imageFileFilter(imageTypes)
	});
}

/** 多图片文件拦截器 */
export function ImagesInterceptor(options: ImagesInterceptorOptions): Type<NestInterceptor> {
	const { fields, fileSize, imageTypes } = options;
	return FileFieldsInterceptor(fields, {
		limits: {
			fileSize: fileSize
		},
		fileFilter: imageFileFilter(imageTypes)
	});
}

/** 筛选函数 */
function imageFileFilter(imageTypes: ImageTypeList): FilterFunction {
	return (_req, file, cb) => {
		// 图片类型
		const imageTypesRegex = new RegExp(`\\.(${imageTypes.join("|")})$`, "i");
		if (!imageTypesRegex.exec(file.originalname)) {
			return cb(
				new BadRequestException(`文件格式不正确，只支持${imageTypes.join("、")}格式`),
				false
			);
		}

		cb(null, true);
	};
}
