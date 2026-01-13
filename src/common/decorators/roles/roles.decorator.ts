import { SetMetadata } from "@nestjs/common";
import { RoleNameEnum } from "@generated/prisma/client";

export const ROLES_KEY = "roles";

export const Roles = (roles: RoleNameEnum[]) => SetMetadata(ROLES_KEY, roles);
