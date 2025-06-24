/*
 * @Author: mulingyuer
 * @Date: 2025-06-24 15:39:28
 * @LastEditTime: 2025-06-24 16:45:14
 * @LastEditors: mulingyuer
 * @Description: redis服务
 * @FilePath: \nestjs-prisma-template\src\shared\services\redis\redis.service.ts
 * 怎么可能会有bug！！！
 */

import { EnvEnum } from "@/common/enums";
import { checkEnv } from "@/utils/tools";
import { Injectable, Logger, type OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService extends Redis implements OnModuleInit {
	private readonly logger = new Logger(RedisService.name);

	constructor(private readonly configService: ConfigService) {
		super({
			host: configService.get<string>(EnvEnum.REDIS_HOST),
			port: Number(configService.get<string>(EnvEnum.REDIS_PORT)),
			password: configService.get<string>(EnvEnum.REDIS_PASSWORD)
		});

		// 校验环境变量
		checkEnv(configService, [EnvEnum.REDIS_HOST, EnvEnum.REDIS_PORT, EnvEnum.REDIS_PASSWORD]);

		// 订阅事件
		this.subscribeRedisEvent();
	}

	onModuleInit() {
		this.logger.log("RedisService模块初始化完成");
	}

	/** 订阅事件 */
	private subscribeRedisEvent() {
		this.on("ready", () => {
			this.logger.log("Redis已连接");
		});

		this.on("error", (error) => {
			this.logger.error(error, "Redis服务连接失败");
		});

		this.on("reconnecting", () => {
			this.logger.log("Redis正在重新连接...");
		});

		this.on("close", () => {
			this.logger.log("Redis连接已关闭");
		});
	}
}
