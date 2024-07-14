import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";

@Injectable()
export class RequestService {
	private readonly logger = new Logger(RequestService.name);
	private axiosInstance: AxiosInstance;

	constructor() {
		this.initAxios();
	}

	/** 初始化axios */
	private initAxios() {
		this.axiosInstance = axios.create({
			timeout: 30 * 1000 // 30s
		});

		// 请求前拦截器
		this.axiosInstance.interceptors.request.use((config) => {
			// 日志
			this.logger.log(config, "请求准备发送");
			return config;
		});

		// 响应拦截器
		this.axiosInstance.interceptors.response.use(
			(response) => {
				// 日志
				this.logger.log(response, "请求成功响应");
				// 根据项目情况做解包处理
				return response.data;
			},
			(error) => {
				// 日志
				this.logger.error(error, `请求发生错误`);
				// 请求被取消
				if (axios.isCancel(error)) {
					this.logger.log(`请求被取消: ${error.message}`);
					return Promise.reject(new InternalServerErrorException(error.message));
				}

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
					this.logger.error(error, `请求发生已知范围内的错误`);
					return Promise.reject(
						new InternalServerErrorException(error.response?.data?.message ?? error.message)
					);
				}

				// Error
				if (error instanceof Error) {
					this.logger.error(error, `请求发生错误`);
					return Promise.reject(new InternalServerErrorException(error.message));
				}

				// 其他
				this.logger.error(error, `请求发生未知错误`);
				return Promise.reject(new InternalServerErrorException("未知错误"));
			}
		);
	}

	/** 通用请求 */
	request<T>(options: AxiosRequestConfig): Promise<T> {
		return this.axiosInstance(options);
	}
}
