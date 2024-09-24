/*
 * @Author: mulingyuer
 * @Date: 2024-09-24 16:27:59
 * @LastEditTime: 2024-09-24 16:28:06
 * @LastEditors: mulingyuer
 * @Description: 请求封装
 * @FilePath: \nestjs-prisma-template\src\utils\request\index.ts
 * 怎么可能会有bug！！！
 */

import axios, { AxiosError } from "axios";
import type { CreateRequestOptions, RequestConfig, RequestInterceptors } from "./types";
export type * from "./types";
import axiosRetry from "axios-retry";
import { mergeOptions } from "@utils/tools";
import { InternalServerErrorException } from "@nestjs/common";

/** 生成请求配置 */
function createRequestConfig(options?: CreateRequestOptions) {
	const defaultConfig: RequestConfig = {
		enableRetry: false, // 是否开启请求重试
		timeout: 30 * 1000 // 30s
	};
	if (!options?.config) return defaultConfig;

	// 合并配置
	return mergeOptions<RequestConfig>(defaultConfig, options.config);
}

/** 生成重试配置 */
function createRetryConfig(options?: CreateRequestOptions) {
	const defaultConfig: CreateRequestOptions["retryConfig"] = {
		retries: 3,
		retryCondition(error: AxiosError) {
			const config: RequestConfig | undefined = error?.config;
			if (!config) return false;
			if (config.enableRetry) return true;
			return false;
		}
	};

	if (!options?.retryConfig) return defaultConfig;

	return mergeOptions<CreateRequestOptions["retryConfig"]>(defaultConfig, options.retryConfig);
}

/** 生成请求拦截器配置 */
function createRequestInterceptorConfig(options?: CreateRequestOptions) {
	const defaultFulfilled: RequestInterceptors["requestFulfilled"] = (config) => config;
	const defaultRejected: RequestInterceptors["requestRejected"] = (error) => error;

	const fulfilled = options?.interceptors?.requestFulfilled ?? defaultFulfilled;
	const rejected = options?.interceptors?.requestRejected ?? defaultRejected;

	return [fulfilled, rejected];
}

/** 生成响应拦截器配置 */
function createResponseInterceptorConfig(options?: CreateRequestOptions) {
	const defaultFulfilled: RequestInterceptors["responseFulfilled"] = (response) => {
		// 根据项目情况做解包处理
		return response.data;
	};
	const defaultRejected: RequestInterceptors["responseRejected"] = (error) => {
		// 请求被取消
		if (axios.isCancel(error)) {
			return Promise.reject(new InternalServerErrorException(error.message));
		}

		// AxiosError
		if (error instanceof AxiosError) {
			return Promise.reject(
				new InternalServerErrorException(error.response?.data?.message ?? error.message)
			);
		}

		// Error
		if (error instanceof Error) {
			return Promise.reject(new InternalServerErrorException(error.message));
		}

		// 其他
		return Promise.reject(new InternalServerErrorException("未知错误"));
	};

	const fulfilled = options?.interceptors?.responseFulfilled ?? defaultFulfilled;
	const rejected = options?.interceptors?.responseRejected ?? defaultRejected;

	return [fulfilled, rejected];
}

/** 创建请求实例 */
export function createRequest(options?: CreateRequestOptions) {
	const instance = axios.create(createRequestConfig(options));

	/** 请求重试 */
	axiosRetry(instance, createRetryConfig(options));

	/** 请求前拦截器 */
	instance.interceptors.request.use(...createRequestInterceptorConfig(options));

	/** 响应后拦截器 */
	instance.interceptors.response.use(...createResponseInterceptorConfig(options));

	return instance;
}
