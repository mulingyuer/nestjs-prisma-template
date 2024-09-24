import { SetMetadata } from "@nestjs/common";
import { PermissionEnum } from "@prisma/client";

export const PERMISSIONS_KEY = "permissions";

export const Permissions = (permissions: PermissionEnum[]) => {
	return SetMetadata("permissions", permissions);
};
