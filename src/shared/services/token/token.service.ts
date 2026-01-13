import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";

@Injectable()
export class TokenService {
	constructor(private readonly jwtService: JwtService) {}

	/** 生成token */
	generateToken(payload: any, expiresIn?: JwtSignOptions["expiresIn"]): string {
		const options: JwtSignOptions = {};
		if (typeof expiresIn !== "undefined") {
			options.expiresIn = expiresIn;
		}

		return this.jwtService.sign(payload, options);
	}

	/** 获取token的有效期 ms*/
	getTokenExpiration(token: string) {
		const { exp } = this.jwtService.decode<{ exp: number }>(token);
		return exp * 1000;
	}
}
