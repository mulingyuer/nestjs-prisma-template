import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { InternalServerErrorException } from "@nestjs/common";
import helmet from "helmet";
import { Logger } from "nestjs-pino";
import { initSwaggerDocument } from "@/swagger";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { bufferLogs: true });
	const configService = app.get(ConfigService);

	// prefix
	const prefix = configService.get<string>("GLOBAL_PREFIX");
	if (prefix) {
		app.setGlobalPrefix(prefix);
	}

	// 头信息安全
	app.use(
		helmet({
			crossOriginResourcePolicy: { policy: "cross-origin" }
		})
	);
	// 跨域
	const corsEnabled = configService.get("CORS_ENABLED");
	if (corsEnabled === "true") {
		app.enableCors({
			origin: "*"
		});
	}

	// 日志
	app.useLogger(app.get(Logger));

	// Swagger
	const swaggerEnabled = configService.get("SWAGGER_ENABLED");
	if (swaggerEnabled === "true") {
		initSwaggerDocument({
			app,
			configService,
			basePath: prefix ? `/${prefix}` : ""
		});
	}

	// 端口
	const port = configService.get<string>("PORT");
	if (!port) {
		throw new InternalServerErrorException("缺失PORT配置");
	}
	await app.listen(port);
}
bootstrap();
