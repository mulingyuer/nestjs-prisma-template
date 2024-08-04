/*
 * @Author: mulingyuer
 * @Date: 2024-08-04 10:13:19
 * @LastEditTime: 2024-08-04 10:13:31
 * @LastEditors: mulingyuer
 * @Description: 分页实体
 * @FilePath: \nestjs-prisma-template\src\common\entities\pagination.entity.ts
 * 怎么可能会有bug！！！
 */

export interface PaginationEntityData<T> {
	current_page: number;
	page_size: number;
	total: number;
	list: T[];
}

export class PaginationEntity<T> {
	/** 当前页 */
	current_page: number;
	/** 分页大小 */
	page_size: number;
	/** 总数量 */
	total: number;
	/** 列表 */
	list: T[];

	constructor(data: PaginationEntityData<T>) {
		Object.assign(this, data);
	}
}
