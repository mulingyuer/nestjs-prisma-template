import { ContentType } from "@common/decorators";
import { ImageInterceptor } from "@common/interceptors";
import { Controller, HttpStatus, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ImageEntity } from "./entities/image.entity";
import { UploadService } from "./upload.service";

@Controller("upload")
@ApiTags("upload")
export class UploadController {
	constructor(private readonly uploadService: UploadService) {}

	/** 单图片上传 */
	@Post("image")
	@ContentType("multipart/form-data")
	@UseInterceptors(
		ImageInterceptor({
			fieldName: "file",
			imageTypes: ["jpg", "jpeg", "png"],
			fileSize: 5 * 1024 * 1024
		})
	)
	@ApiOperation({ summary: "单图片上传" })
	@ApiConsumes("multipart/form-data")
	@ApiBody({
		schema: {
			type: "object",
			properties: {
				file: {
					type: "string",
					format: "binary"
				}
			}
		}
	})
	@ApiResponse({ status: HttpStatus.OK, type: ImageEntity })
	uploadImage(@UploadedFile() file: Express.Multer.File) {
		return new ImageEntity(file);
	}
}
