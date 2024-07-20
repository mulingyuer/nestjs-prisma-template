/*
 * @Author: mulingyuer
 * @Date: 2024-07-03 16:37:54
 * @LastEditTime: 2024-07-18 17:49:31
 * @LastEditors: mulingyuer
 * @Description: swagger文档
 * @FilePath: \ease-change-backend\src\swagger\index.ts
 * 怎么可能会有bug！！！
 */
import type { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { joinUrl } from "@utils/tools";

export interface InitOptions {
	app: INestApplication;
	configService: ConfigService;
	basePath?: string;
}

export function initSwaggerDocument(options: InitOptions) {
	const { app, configService, basePath } = options;
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
			basePath: joinUrl(basePath),
			persistAuthorization: true
		}
	});
}
