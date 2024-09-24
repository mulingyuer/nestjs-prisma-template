/*
 * @Author: mulingyuer
 * @Date: 2024-09-19 11:36:22
 * @LastEditTime: 2024-09-19 15:59:47
 * @LastEditors: mulingyuer
 * @Description: 请求类型
 * @FilePath: \ease-change-backend\src\utils\request\types.ts
 * 怎么可能会有bug！！！
 */
import type {
	AxiosInterceptorManager,
	AxiosRequestConfig,
	AxiosResponse,
	CreateAxiosDefaults,
	InternalAxiosRequestConfig
} from "axios";
import type { IAxiosRetryConfig } from "axios-retry";

/** 请求配置 */
export interface RequestConfig extends AxiosRequestConfig {
	/** 是否允许失败重试 */
	enableRetry?: boolean;
}

type InterceptorsRequest = Parameters<AxiosInterceptorManager<InternalAxiosRequestConfig>["use"]>;
type InterceptorsResponse = Parameters<AxiosInterceptorManager<AxiosResponse>["use"]>;

/** 拦截器 */
export interface RequestInterceptors {
	requestFulfilled?: InterceptorsRequest[0];
	requestRejected?: InterceptorsRequest[1];
	responseFulfilled?: InterceptorsResponse[0];
	responseRejected?: InterceptorsResponse[1];
}

/** 创建请求实例参数 */
export interface CreateRequestOptions extends CreateAxiosDefaults {
	config?: RequestConfig;
	/** 拦截器 */
	interceptors?: RequestInterceptors;
	/** 重试参数 */
	retryConfig?: IAxiosRetryConfig;
}
