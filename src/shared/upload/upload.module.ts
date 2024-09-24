import { InternalServerErrorException, Module } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { UploadController } from "./upload.controller";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { ConfigService } from "@nestjs/config";
import { extname } from "path";
import { joinRootPath } from "@utils/tools";
import { EnvEnum } from "@common/enums";

@Module({
	imports: [
		MulterModule.registerAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				const uploadDir = configService.get<string>(EnvEnum.UPLOAD_DIR);
				if (!uploadDir || uploadDir.trim() === "") {
					throw new InternalServerErrorException("缺少上传目录配置 UPLOAD_DIR");
				}
				return {
					storage: diskStorage({
						destination: joinRootPath(uploadDir),
						filename: (_req, file, cb) => {
							const ext = extname(file.originalname);
							cb(null, `${Date.now()}-${Math.round(Math.random() * 1e10)}${ext}`);
						}
					})
				};
			}
		})
	],
	controllers: [UploadController],
	providers: [UploadService]
})
export class UploadModule {}
