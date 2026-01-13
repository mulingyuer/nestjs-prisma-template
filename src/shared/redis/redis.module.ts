import { Global, Logger, Module } from "@nestjs/common";
import { Redis } from "ioredis";
import { ConfigService } from "@nestjs/config";
import { checkEnv } from "@/utils/tools";
import { EnvEnum } from "@/common/enums";

/** ioredis服务名 */
export const REDIS_CLIENT = "IOREDIS_REDIS_CLIENT";

@Global()
@Module({
	imports: [],
	providers: [
		{
			provide: REDIS_CLIENT,
			useFactory: (configService: ConfigService) => {
				const logger = new Logger(REDIS_CLIENT);
				// 校验环境变量
				checkEnv(configService, [EnvEnum.REDIS_HOST, EnvEnum.REDIS_PORT, EnvEnum.REDIS_PASSWORD]);
				const redisHost = configService.get<string>(EnvEnum.REDIS_HOST)!;
				const redisPort = configService.get<string>(EnvEnum.REDIS_PORT)!;
				const redisPassword = configService.get<string>(EnvEnum.REDIS_PASSWORD)! ?? void 0;

				// 创建 ioredis 客户端实例
				const redisClient = new Redis({
					host: redisHost,
					port: Number(redisPort),
					password: redisPassword
				});

				// 可选：监听 Redis 连接事件
				redisClient.on("connect", () => {
					logger.log("成功链接到 Redis");
				});
				redisClient.on("error", (err) => {
					logger.error("Redis 错误:", err);
				});

				return redisClient;
			},
			inject: [ConfigService]
		}
	],
	exports: [REDIS_CLIENT]
})
export class RedisModule {}
