/*
 * @Author: mulingyuer
 * @Date: 2024-07-05 09:53:44
 * @LastEditTime: 2024-07-21 03:50:36
 * @LastEditors: mulingyuer
 * @Description: 图片校验拦截器
 * @FilePath: \nestjs-prisma-template\src\common\interceptors\image\image.interceptor.ts
 * 怎么可能会有bug！！！
 */
import {
	BadRequestException,
	CallHandler,
	ExecutionContext,
	UseInterceptors
} from "@nestjs/common";
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import type { Request } from "express";
import type {
	FilterFunction,
	ImageArrayInterceptorOptions,
	ImageInterceptorOptions,
	ImagesInterceptorOptions,
	ImageTypeList
} from "./types";
export type * from "./types";

/** 单图片文件拦截器 */
export function ImageInterceptor(options: ImageInterceptorOptions) {
	const { fieldName, fileSize, imageTypes } = options;

	return UseInterceptors(
		FileInterceptor(fieldName, {
			limits: {
				fileSize: fileSize,
				files: 1
			},
			fileFilter: imageFileFilter(imageTypes)
		}),
		{
			intercept: (context: ExecutionContext, next: CallHandler) => {
				const request = context.switchToHttp().getRequest<Request>();

				if (!request.file) {
					throw new BadRequestException("请上传图片文件");
				}
				return next.handle();
			}
		}
	);
}

/** 图片文件数组拦截器 */
export function ImageArrayInterceptor(options: ImageArrayInterceptorOptions) {
	const { fieldName, fileSize, imageTypes, maxCount } = options;
	return UseInterceptors(
		FilesInterceptor(fieldName, maxCount, {
			limits: {
				fileSize: fileSize
			},
			fileFilter: imageFileFilter(imageTypes)
		}),
		{
			intercept: (context: ExecutionContext, next: CallHandler) => {
				const request = context.switchToHttp().getRequest<Request>();

				if (!request.files || request.files.length === 0) {
					throw new BadRequestException("请上传图片文件");
				}
				return next.handle();
			}
		}
	);
}

/** 多图片文件拦截器 */
export function ImagesFieldsInterceptor(options: ImagesInterceptorOptions) {
	const { fields, fileSize, imageTypes } = options;
	return UseInterceptors(
		FileFieldsInterceptor(fields, {
			limits: {
				fileSize: fileSize
			},
			fileFilter: imageFileFilter(imageTypes)
		}),
		{
			intercept: (context: ExecutionContext, next: CallHandler) => {
				const request = context.switchToHttp().getRequest<Request>();
				const fileKeys = fields.map((item) => item.name);

				if (!request.files || Object.keys(request.files).length === 0) {
					throw new BadRequestException("请上传图片文件");
				}

				const lackKeys = fileKeys.filter((key) => !Object.hasOwn(request.files, key));
				if (lackKeys.length > 0) {
					throw new BadRequestException(`缺少${lackKeys.join("、")}图片文件`);
				}

				return next.handle();
			}
		}
	);
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
