/*
 * @Author: mulingyuer
 * @Date: 2024-07-10 16:06:33
 * @LastEditTime: 2025-06-26 11:12:14
 * @LastEditors: mulingyuer
 * @Description: 通用分页dto
 * @FilePath: \nestjs-prisma-template\src\common\dto\pagination.dto.ts
 * 怎么可能会有bug！！！
 */

import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class PaginationDto {
	/** 当前页 */
	@ApiProperty({ required: false, default: 1 })
	@IsInt({ message: "当前页必须为整数" })
	@Transform(({ value }) => (value === undefined || value === "" ? 1 : Number(value)))
	@IsOptional()
	current_page: number;

	/** 每页条数 */
	@ApiProperty({ required: false, default: 15 })
	@IsInt({ message: "每页数量必须为整数" })
	@Transform(({ value }) => (value === undefined || value === "" ? 15 : Number(value)))
	@IsOptional()
	page_size: number;
}
