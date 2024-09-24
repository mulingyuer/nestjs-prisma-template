import { Injectable, InternalServerErrorException, OnModuleInit, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient, Prisma } from "@prisma/client";
import { EnvEnum } from "@common/enums";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	private readonly logger = new Logger(PrismaService.name);

	constructor(private readonly config: ConfigService) {
		// 日志
		const logList: Array<Prisma.LogDefinition> = [
			{
				emit: "event",
				level: "error"
			}
		];
		if (config.get(EnvEnum.NODE_ENV) === "development") {
			logList.push(
				{
					emit: "event",
					level: "query"
				},
				{
					emit: "event",
					level: "info"
				},
				{
					emit: "event",
					level: "warn"
				}
			);
		}
		super({ log: logList });

		// 监听日志
		logList.forEach(({ level }) => {
			// @ts-expect-error prisma的类型推断成never了，无法赋值
			this.$on(level, (e) => {
				const type = ["query", "info"].includes(level) ? "log" : level;
				if (typeof this.logger[type] === "function") {
					this.logger[type](e);
				}
			});
		});
	}

	/** 模块首次初始化 */
	onModuleInit() {
		return this.$connect().catch((error) => {
			throw new InternalServerErrorException(`数据库连接失败: ${error.message}`);
		});
	}
}
