import { BadRequestException, Injectable, ValidationError, ValidationPipe } from "@nestjs/common";

@Injectable()
export class ValidationPipePipe extends ValidationPipe {
	constructor() {
		super({
			stopAtFirstError: true, // 停止在第一个错误
			whitelist: true, // 启用白名单，dto中没有声明的属性自动过滤
			transform: true, // 自动转换类型（query参数还是string，需要自己转）\
			// 只输出一条错误信息，哪怕多个验证错误
			exceptionFactory: (errors: ValidationError[]) => {
				const message = this.getFirstErrorMessage(errors);
				return new BadRequestException(message);
			}
		});
	}

	/** 获取第一个错误对象的message */
	private getFirstErrorMessage(errors: ValidationError[]) {
		const firstError = errors[0];
		if (firstError.constraints) {
			// 单属性错误
			const message = Object.values(firstError.constraints).join(",");
			return message;
		} else {
			// 嵌套属性错误
			const errorChildren = firstError.children;
			return this.getFirstErrorMessage(errorChildren);
		}
	}
}
