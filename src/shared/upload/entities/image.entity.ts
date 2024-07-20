/*
 * @Author: mulingyuer
 * @Date: 2024-07-05 11:36:07
 * @LastEditTime: 2024-07-05 16:49:16
 * @LastEditors: mulingyuer
 * @Description: 单图片上传实体
 * @FilePath: \ease-change-backend\src\shared\upload\entities\image.entity.ts
 * 怎么可能会有bug！！！
 */
import type { Express } from "express";
import { Exclude, Expose } from "class-transformer";
import { ApiHideProperty } from "@nestjs/swagger";
import { Readable } from "stream";

@Exclude()
export class ImageEntity implements Express.Multer.File {
	/** 文件类型 */
	@Expose()
	mimetype: string;

	/** 文件大小 byt */
	@Expose()
	size: number;

	/** 完整文件名 */
	@Expose()
	filename: string;

	@ApiHideProperty()
	fieldname: string;

	@ApiHideProperty()
	originalname: string;

	@ApiHideProperty()
	encoding: string;

	@ApiHideProperty()
	stream: Readable;

	@ApiHideProperty()
	destination: string;

	@ApiHideProperty()
	path: string;

	@ApiHideProperty()
	buffer: Buffer;

	constructor(file: Express.Multer.File) {
		Object.assign(this, file);
	}
}
