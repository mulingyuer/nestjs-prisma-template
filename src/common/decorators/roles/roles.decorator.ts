import { SetMetadata } from "@nestjs/common";
import { RoleNameEnum } from "@prisma/client";

export const ROLES_KEY = "roles";

export const Roles = (roles: RoleNameEnum[]) => SetMetadata(ROLES_KEY, roles);
