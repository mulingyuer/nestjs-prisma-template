/*
 * @Author: mulingyuer
 * @Date: 2024-07-03 16:37:54
 * @LastEditTime: 2024-08-04 08:58:34
 * @LastEditors: mulingyuer
 * @Description: swagger文档
 * @FilePath: \nestjs-prisma-template\src\swagger\index.ts
 * 怎么可能会有bug！！！
 */
import type { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export interface InitOptions {
	app: INestApplication;
	configService: ConfigService;
}

export function initSwaggerDocument(options: InitOptions) {
	const { app, configService } = options;
	const title = configService.get("SWAGGER_TITLE");
	const description = configService.get("SWAGGER_DESCRIPTION");

	const swaggerOptions = new DocumentBuilder()
		.setTitle(title)
		.setDescription(description)
		// .addBasicAuth() // 账号密码认证
		.addBearerAuth() // 令牌认证
		.build();
	const document = SwaggerModule.createDocument(app, swaggerOptions);

	SwaggerModule.setup("docs", app, document, {
		jsonDocumentUrl: "/swagger/json",
		swaggerOptions: {
			persistAuthorization: true
		}
	});
}
