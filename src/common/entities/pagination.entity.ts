/*
 * @Author: mulingyuer
 * @Date: 2024-08-04 10:13:19
 * @LastEditTime: 2025-06-26 11:12:31
 * @LastEditors: mulingyuer
 * @Description: 分页实体
 * @FilePath: \nestjs-prisma-template\src\common\entities\pagination.entity.ts
 * 怎么可能会有bug！！！
 */

/** 分页实体数据接口 */
export interface PaginationEntityData<T> {
	/** 当前页 */
	current_page: number;
	/** 分页大小 */
	page_size: number;
	/** 总数量 */
	total: number;
	/** 列表 */
	list: T[];
}

/**
 * 分页实体基类
 */
export abstract class PaginationEntity<TRaw, TTarget> {
	/** 当前页 */
	current_page: number;
	/** 分页大小 */
	page_size: number;
	/** 总数量 */
	total: number;
	/** 列表，子类实现请用declare关键词声明为不需要实现 */
	list: TTarget[];

	/**
	 * 构造函数
	 * @param data 分页数据
	 */
	constructor(data: PaginationEntityData<TRaw>) {
		this.current_page = data.current_page;
		this.page_size = data.page_size;
		this.total = data.total;
		this.list = data.list.map((item) => this.transformListItem(item, data));
	}

	/**
	 * 抽象方法：转换列表项
	 * 子类必须实现此方法来定义如何将原始数据转换为目标数据
	 * @param item 原始数据项
	 * @returns 转换后的数据项
	 */
	protected abstract transformListItem(item: TRaw, originData: PaginationEntityData<TRaw>): TTarget;
}
