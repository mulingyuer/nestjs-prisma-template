/*
 * @Author: mulingyuer
 * @Date: 2024-09-24 15:49:26
 * @LastEditTime: 2024-09-24 15:52:46
 * @LastEditors: mulingyuer
 * @Description: 环境变量枚举
 * @FilePath: \nestjs-prisma-template\src\common\enum\environment.enum.ts
 * 怎么可能会有bug！！！
 */

export enum EnvEnum {
	/** Node 环境 */
	NODE_ENV = "NODE_ENV",
	/** 数据库连接 URL */
	DATABASE_URL = "DATABASE_URL",
	/** 数据填充模式 */
	DB_SEED_MODE = "DB_SEED_MODE",
	/** 后端域名 */
	BACKEND_DOMAIN = "BACKEND_DOMAIN",
	/** 端口 */
	PORT = "PORT",
	/** 全局前缀 */
	GLOBAL_PREFIX = "GLOBAL_PREFIX",
	/** 是否启用跨域 */
	CORS_ENABLED = "CORS_ENABLED",
	/** JWT 密钥 */
	JWT_SECRET = "JWT_SECRET",
	/** JWT 过期时间 */
	JWT_EXPIRES_IN = "JWT_EXPIRES_IN",
	/** hash-saltOrRounds */
	HASH_SALT_OR_ROUNDS = "HASH_SALT_OR_ROUNDS",
	/** 是否启用 Swagger */
	SWAGGER_ENABLED = "SWAGGER_ENABLED",
	/** Swagger 标题 */
	SWAGGER_TITLE = "SWAGGER_TITLE",
	/** Swagger 描述 */
	SWAGGER_DESCRIPTION = "SWAGGER_DESCRIPTION",
	/** 文件上传路径 */
	UPLOAD_DIR = "UPLOAD_DIR"
}
