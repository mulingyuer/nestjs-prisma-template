import { SetMetadata } from "@nestjs/common";
import type { ContentType as ImportedContentType } from "@common/guards/content-type/types";

export const IS_CONTENT_TYPE_KEY = "isContentType";

export const ContentType = (contentType: ImportedContentType) =>
	SetMetadata(IS_CONTENT_TYPE_KEY, contentType);
