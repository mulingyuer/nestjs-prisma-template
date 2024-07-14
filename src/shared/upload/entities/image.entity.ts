/*
 * @Author: mulingyuer
 * @Date: 2024-07-05 11:36:07
 * @LastEditTime: 2024-07-14 22:11:55
 * @LastEditors: mulingyuer
 * @Description: 单图片上传实体
 * @FilePath: \nestjs-prisma-template\src\shared\upload\entities\image.entity.ts
 * 怎么可能会有bug！！！
 */
import type { Express } from "express";
import { Exclude, Expose } from "class-transformer";
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Readable } from "stream";

@Exclude()
export class ImageEntity implements Express.Multer.File {
	/** 文件类型 */
	@Expose()
	@ApiProperty()
	mimetype: string;

	/** 文件大小 byt */
	@Expose()
	@ApiProperty()
	size: number;

	/** 完整文件名 */
	@Expose()
	@ApiProperty()
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
