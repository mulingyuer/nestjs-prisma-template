/*
 * @Author: mulingyuer
 * @Date: 2024-07-03 16:37:54
 * @LastEditTime: 2025-04-16 15:41:44
 * @LastEditors: mulingyuer
 * @Description: swagger文档
 * @FilePath: \nest-demo\src\swagger\index.ts
 * 怎么可能会有bug！！！
 */
import type { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { EnvEnum } from "@common/enums";
import { getRootPath } from "@/utils/tools";
import { writeFileSync } from "fs";

export interface InitOptions {
	app: INestApplication;
	configService: ConfigService;
	/** 是否保存文档到json文件 */
	saveJson?: boolean;
}

export function initSwaggerDocument(options: InitOptions) {
	const { app, configService, saveJson = false } = options;
	const title = configService.get(EnvEnum.SWAGGER_TITLE);
	const description = configService.get(EnvEnum.SWAGGER_DESCRIPTION);

	const swaggerOptions = new DocumentBuilder()
		.setTitle(title)
		.setDescription(description)
		// .addBasicAuth() // 账号密码认证
		.addBearerAuth() // 令牌认证
		.build();
	const document = SwaggerModule.createDocument(app, swaggerOptions);

	// 保存openapi文档到json文件，用于遵守openapi规范
	if (saveJson) {
		const jsonDocument = JSON.stringify(document, null, 2);
		const jsonDocumentPath = `${getRootPath()}/openapi.json`;
		writeFileSync(jsonDocumentPath, jsonDocument);
	}

	SwaggerModule.setup("docs", app, document, {
		jsonDocumentUrl: "/swagger/json",
		swaggerOptions: {
			persistAuthorization: true
		}
	});
}
