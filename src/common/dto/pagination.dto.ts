/*
 * @Author: mulingyuer
 * @Date: 2024-07-10 16:06:33
 * @LastEditTime: 2024-07-11 11:13:24
 * @LastEditors: mulingyuer
 * @Description: 通用分页dto
 * @FilePath: \ease-change-backend\src\common\dto\pagination.dto.ts
 * 怎么可能会有bug！！！
 */

import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class PaginationDto {
	/** 当前页 */
	@ApiProperty()
	@IsNumber({ allowNaN: false }, { message: "当前页必须为数字" })
	@Type(() => Number)
	current_page: number = 1;

	/** 每页条数 */
	@ApiProperty()
	@IsNumber({ allowNaN: false }, { message: "每页数量必须为数字" })
	@Type(() => Number)
	page_size: number = 15;
}
