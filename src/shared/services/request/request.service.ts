import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import type { RequestConfig } from "@utils/request";
import { createRequest } from "@utils/request";
import type { AxiosInstance } from "axios";
import axios, { AxiosError } from "axios";

@Injectable()
export class RequestService {
	private readonly logger = new Logger(RequestService.name);
	private axiosInstance: AxiosInstance;

	constructor() {
		this.initAxios();
	}

	/** 初始化axios */
	private initAxios() {
		this.axiosInstance = createRequest({
			interceptors: {
				requestFulfilled: (config) => {
					// 日志
					this.logger.log(config, "请求准备发送");
					return config;
				},
				responseFulfilled: (response) => {
					// 日志
					this.logger.log(response, "请求成功响应");
					// 根据项目情况做解包处理
					return response.data;
				},
				responseRejected: (error) => {
					// 请求被取消
					if (axios.isCancel(error)) {
						// 日志
						this.logger.log(`请求被取消: ${error.message}`);
						return Promise.reject(new InternalServerErrorException(error.message));
					}

					// 日志
					this.logger.error(error, `请求发生错误`);

					// AxiosError
					if (error instanceof AxiosError) {
						/**
						 * 异常响应
						 * {
						 *  "status": "error",
						 *  "user_id": model.user_id,
						 *  "task_id": model.task_id,
						 *  "message": "error message"
						 * }
						 */
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
				}
			}
		});
	}

	/** 通用请求 */
	request<T>(options: RequestConfig): Promise<T> {
		return this.axiosInstance(options);
	}
}
