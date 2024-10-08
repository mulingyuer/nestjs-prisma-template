/*
 * @Author: mulingyuer
 * @Date: 2024-07-02 10:38:56
 * @LastEditTime: 2024-09-24 16:51:53
 * @LastEditors: mulingyuer
 * @Description: 共享模块
 * @FilePath: \nestjs-prisma-template\src\shared\shared.module.ts
 * 怎么可能会有bug！！！
 */
import { HttpExceptionFilter } from "@common/filters";
import {
	ContentTypeGuardFactory,
	JwtAuthGuard,
	PermissionsGuard,
	RolesGuard
} from "@common/guards";
import { ResponseInterceptor } from "@common/interceptors";
import { ValidationPipePipe } from "@common/pipes";
import { ClassSerializerInterceptor, Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { checkEnv, getLogTime, joinRootPath } from "@utils/tools";
import { LoggerErrorInterceptor, LoggerModule } from "nestjs-pino";
import { PrismaModule } from "./prisma/prisma.module";
import { RequestService } from "./services/request/request.service";
import { UploadModule } from "./upload/upload.module";
import { EnvEnum } from "@common/enums";

const NODE_ENV = process.env[EnvEnum.NODE_ENV];
const isDev = NODE_ENV === "development";

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: isDev ? ".env.development" : `.env.${NODE_ENV}`
		}),
		PrismaModule,
		JwtModule.registerAsync({
			global: true,
			useFactory(configService: ConfigService) {
				// 校验环境变量
				checkEnv(configService, [EnvEnum.JWT_SECRET, EnvEnum.JWT_EXPIRES_IN]);
				const secret = configService.get<string>(EnvEnum.JWT_SECRET);
				const expiresIn = configService.get<string>(EnvEnum.JWT_EXPIRES_IN);

				return {
					secret,
					signOptions: {
						expiresIn
					}
				};
			},
			inject: [ConfigService]
		}),
		LoggerModule.forRoot({
			pinoHttp: {
				/**
				 * fatal (60): 严重错误，应用程序将会退出
				 * error (50): 错误事件
				 * warn (40): 警告信息
				 * info (30): 常规信息（默认）
				 * debug (20): 调试信息
				 * trace (10): 跟踪信息
				 */
				level: isDev ? "trace" : "info",
				customProps: (_req, _res) => ({
					context: "HTTP"
				}),
				timestamp: () => `,"time":"${getLogTime()}"`,
				transport: isDev
					? {
							target: "pino-pretty",
							options: {
								singleLine: true
							}
						}
					: {
							target: "pino-roll",
							options: {
								file: joinRootPath("/logs/pino"),
								frequency: "daily",
								size: "10M",
								mkdir: true,
								extension: ".log"
							}
						}
			}
		}),
		UploadModule
	],
	providers: [
		// 校验
		{
			provide: APP_PIPE,
			useClass: ValidationPipePipe
		},
		// 统一响应格式
		{
			provide: APP_INTERCEPTOR,
			useClass: ResponseInterceptor
		},
		// 序列化
		{
			provide: APP_INTERCEPTOR,
			useClass: ClassSerializerInterceptor
		},
		// 异常处理
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter
		},
		// 鉴权
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard
		},
		// HTTP日志拦截器
		{
			provide: APP_INTERCEPTOR,
			useClass: LoggerErrorInterceptor
		},
		// content-type 校验
		{
			provide: APP_GUARD,
			useClass: ContentTypeGuardFactory("application/json")
		},
		// 角色鉴权
		{
			provide: APP_GUARD,
			useClass: RolesGuard
		},
		// 权限鉴权
		{
			provide: APP_GUARD,
			useClass: PermissionsGuard
		},
		RequestService
	],
	exports: [RequestService],
	controllers: []
})
export class SharedModule {}
