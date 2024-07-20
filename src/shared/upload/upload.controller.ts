import { ContentType } from "@common/decorators";
import {
	ImageArrayInterceptor,
	ImageInterceptor,
	ImagesFieldsInterceptor
} from "@common/interceptors";
import { Controller, HttpStatus, Post, UploadedFile, UploadedFiles } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ImageEntity } from "./entities/image.entity";
import { UploadService } from "./upload.service";

@Controller("upload")
@ApiTags("upload")
export class UploadController {
	constructor(private readonly uploadService: UploadService) {}

	/** 单图片上传 */
	@Post("image")
	@ContentType("multipart/form-data")
	@ImageInterceptor({
		fieldName: "file",
		imageTypes: ["jpg", "jpeg", "png"],
		fileSize: 5 * 1024 * 1024
	})
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

	/** 图片数组上传 */
	@Post("images")
	@ContentType("multipart/form-data")
	@ImageArrayInterceptor({
		fieldName: "files",
		imageTypes: ["jpg", "jpeg", "png"],
		fileSize: 5 * 1024 * 1024,
		maxCount: 2
	})
	@ApiConsumes("multipart/form-data")
	@ApiBody({
		schema: {
			type: "object",
			properties: {
				files: {
					type: "array",
					items: {
						type: "string",
						format: "binary"
					}
				}
			}
		}
	})
	@ApiResponse({ status: HttpStatus.OK, type: [ImageEntity] })
	uploadImages(@UploadedFiles() files: Array<Express.Multer.File>) {
		return files.map((file) => new ImageEntity(file));
	}

	/** 图片多文件上传 */
	@Post("images-fields")
	@ContentType("multipart/form-data")
	@ImagesFieldsInterceptor({
		fields: [
			{ name: "file1", maxCount: 1 },
			{ name: "file2", maxCount: 1 }
		],
		fileSize: 5 * 1024 * 1024,
		imageTypes: ["jpg", "jpeg", "png"]
	})
	@ApiBody({
		schema: {
			type: "object",
			properties: {
				file1: {
					type: "array",
					items: {
						type: "string",
						format: "binary"
					}
				},
				file2: {
					type: "array",
					items: {
						type: "string",
						format: "binary"
					}
				}
			}
		}
	})
	@ApiResponse({
		status: HttpStatus.OK,
		schema: {
			type: "object",
			properties: {
				file1: {
					type: "array",
					items: { $ref: "#/components/schemas/ImageEntity" }
				},
				file2: {
					type: "array",
					items: { $ref: "#/components/schemas/ImageEntity" }
				}
			}
		}
	})
	uploadImagesFields(
		@UploadedFiles() files: { file1: Array<Express.Multer.File>; file2: Array<Express.Multer.File> }
	) {
		const keys = Object.keys(files) as Array<keyof typeof files>;
		const result: Record<"file1" | "file2", ImageEntity[]> = {
			file1: [],
			file2: []
		};
		keys.forEach((key) => {
			const arr = files[key];
			result[key] = arr.map((file) => new ImageEntity(file));
		});

		return result;
	}
}
