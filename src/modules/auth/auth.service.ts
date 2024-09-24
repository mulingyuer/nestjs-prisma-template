import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "@prisma.service";
import { LoginEntity } from "./entities/login.entity";
import { LoginDto, RegisterDto } from "./dto";
import { hash, compare } from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { RoleNameEnum } from "@prisma/client";
import type { Permissions, DbRoles, DbUser, GenerateTokenData, JwtPayload } from "@common/types";
import { EnvEnum } from "@/common/enums";

@Injectable()
export class AuthService {
	/** 哈希加密用的 */
	private saltOrRounds = 12;

	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) {
		const envSaltOrRounds = this.configService.get<string>(EnvEnum.HASH_SALT_OR_ROUNDS);
		if (typeof envSaltOrRounds === "string" && envSaltOrRounds.trim() !== "") {
			this.saltOrRounds = Number(envSaltOrRounds);
		}
	}

	/** 注册 */
	async register(body: RegisterDto) {
		const { account, nickname, password } = body;

		// 检测账号是否存在
		const { exists: isAccountExists } = await this.findAccount(account);
		if (isAccountExists) throw new BadRequestException("账号已存在");

		// 加密密码
		const hashedPassword = await hash(password, this.saltOrRounds);

		// 查询用户角色id
		const userRole = await this.prismaService.role.findUnique({
			where: { name: RoleNameEnum.USER }
		});
		if (!userRole) throw new NotFoundException("用户角色不存在，请联系管理员");

		// 创建用户
		await this.prismaService.user.create({
			data: {
				nickname,
				account,
				password: hashedPassword,
				roleIds: [userRole.id]
			}
		});

		return "注册成功";
	}

	/** 登录 */
	async login(body: LoginDto) {
		const { account, password } = body;

		// 检测账号是否存在
		const { exists: isAccountExists, user } = await this.findAccount(account);
		if (!isAccountExists) throw new BadRequestException("账号不存在");

		// 检测密码是否正确
		const isMatch = await compare(password, user.password);
		if (!isMatch) throw new BadRequestException("密码错误");

		// 查询用户角色
		const roles = await this.findRoles(user.roleIds);

		// 查询用户角色权限
		const permissions = await this.findPermissions(roles);

		// 生成token
		const token = await this.generateToken({ user, roles, permissions });
		const expiration = this.getTokenExpiration(token);

		return new LoginEntity({ access_token: token, expiration });
	}

	/** 查询账号 */
	private async findAccount(account: string) {
		const user = (await this.prismaService.user.findUnique({ where: { account } })) as DbUser;
		return {
			exists: Boolean(user),
			user
		};
	}

	/** 查询用户角色 */
	private async findRoles(roleIds: Array<number>) {
		const roles = await this.prismaService.role.findMany({
			where: { id: { in: roleIds } }
		});
		return roles as DbRoles;
	}

	/** 查询用户角色权限 */
	private async findPermissions(roles: DbRoles): Promise<Permissions> {
		const permissionIds = [...new Set<number>(roles.flatMap((role) => role.permissionIds))];

		const findPermissions = await this.prismaService.permission.findMany({
			where: { id: { in: permissionIds } }
		});

		return findPermissions.map((item) => item.name);
	}

	/** 生成token */
	private generateToken(data: GenerateTokenData) {
		const { user, roles, permissions } = data;
		return this.jwtService.signAsync({
			sub: user.id,
			nickname: user.nickname,
			roles: roles.map((role) => role.name),
			permissions: permissions
		});
	}

	/** 获取token的有效期 ms*/
	getTokenExpiration(token: string) {
		const { exp } = this.jwtService.decode<JwtPayload>(token);
		return exp * 1000;
	}
}
