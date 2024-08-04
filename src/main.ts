import { initSwaggerDocument } from "@/swagger";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { checkEnv } from "@utils/tools";
import helmet from "helmet";
import { Logger } from "nestjs-pino";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { bufferLogs: true });
	const configService = app.get(ConfigService);

	// 校验环境变量
	checkEnv(configService, ["CORS_ENABLED", "PORT"]);

	// 日志
	app.useLogger(app.get(Logger));

	// prefix
	const prefix = configService.get<string>("GLOBAL_PREFIX") ?? "";
	if (prefix) {
		app.setGlobalPrefix(prefix);
	}

	// Swagger
	const openSwagger = configService.get("SWAGGER_ENABLED") === "true";
	if (openSwagger) {
		initSwaggerDocument({
			app,
			configService
		});
	}

	// 头信息安全
	app.use(
		helmet({
			crossOriginResourcePolicy: { policy: "cross-origin" },
			contentSecurityPolicy: !openSwagger // 开启swagger需要允许页内js
		})
	);

	// 跨域
	const corsEnabled = configService.get("CORS_ENABLED");
	if (corsEnabled === "true") {
		app.enableCors({
			origin: "*"
		});
	}

	// 端口
	const port = configService.get<string>("PORT");
	await app.listen(port);
}
bootstrap();
