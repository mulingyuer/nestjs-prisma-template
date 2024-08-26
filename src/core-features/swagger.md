# Swagger文档

从阅读体验上来说，Swagger文档的阅读体验真的很一般啊，还不如apifox或者Postman的接口测试工具来的直观。

不过用来生成简单用的文档还是很方便的，聊胜于无吧。

## 访问文档

通过配置环境变量来控制是否开启Swagger文档。

```txt
# 是否启用swagger
SWAGGER_ENABLED=true
# swagger 标题
SWAGGER_TITLE="Swagger API"
# swagger 描述
SWAGGER_DESCRIPTION="Swagger API文档"
```

访问地址：<http://localhost:3000/docs>

![访问文档](/images/swagger/01.jpg)

## swagger初始化配置

具体文档配置代码在`src\swagger\index.ts`文件内，控制是否启用swagger在`src\main.ts`文件中。

```typescript
// src\main.ts
// Swagger
 const openSwagger = configService.get("SWAGGER_ENABLED") === "true";
 if (openSwagger) {
  initSwaggerDocument({
   app,
   configService
  });
 }
```

大家可以根据官方文档来配置swagger，这里就不多说了。

文档地址：<https://docs.nestjs.com/openapi/introduction>

## 使用swagger

默认我开启了通过注释来生成swagger文档，所以大部分情况下，只需要在路由控制器上添加注释即可。

```typescript
// auth.controller.ts
import { Public } from "@/common/decorators";
import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
 constructor(private readonly authService: AuthService) {}

 /** 登录 */
 @Get("login")
 @Public()
 login() {
  return this.authService.login();
 }
}

```

`@ApiTags`来实现对控制器的分类，其他基本上不用配置了，效果如下：

![swagger效果图](/images/swagger/02.jpg)

### DTO参数

如果需要生成DTO的文档，可以用`@ApiProperty`来配置。

```typescript
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength } from "class-validator";

export class WechatMiniLoginDto {
 /** 微信code */
 @ApiProperty()
 @MaxLength(255, { message: "code长度不能超过255" })
 @IsNotEmpty({ message: "code不能为空" })
 code: string;
}
```

然后在控制器上使用这个DTO。

```typescript
// auth.controller.ts
import { Public } from "@/common/decorators";
import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { WechatMiniLoginDto, WechatPublicLoginDto } from "./dto";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
 constructor(private readonly authService: AuthService) {}

 /** 登录 */
 @Post("login")
 @Public()
 login(@Body() body: WechatPublicLoginDto) {
  return this.authService.login();
 }
}
```

![DTO效果图](/images/swagger/03.png)

### Entity返回值参数

返回值参数会自动根据`return`返回的Entity对象来生成文档。

```typescript
// auth.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "@prisma.service";
import { LoginEntity } from "./entities/login.entity";

@Injectable()
export class AuthService {
 constructor(
  private readonly prismaService: PrismaService,
  private readonly jwtService: JwtService
 ) {}

 /** 登录 */
 async login() {
  const user = await this.prismaService.user.findUnique({ where: { id: 1 } });
  if (!user) {
   throw new NotFoundException("查找不到用户");
  }

  const token = await this.generateToken(user.id);

  return new LoginEntity(token);
 }

 /** 生成token */
 private generateToken(userId: number) {
  return this.jwtService.signAsync({ sub: userId });
 }
}
```

这里使用了`LoginEntity`，它内容如下：

```typescript
// login.entity.ts
export class LoginEntity {
 access_token: string;

 constructor(token: string) {
  this.access_token = token;
 }
}
```

![Entity效果图](/images/swagger/04.jpg)

建议所有的return值都用Entity来包装，这样可以更好的描述返回值。

### 其他配置

swagger本身提供了很多装饰器，除了上述的，还有一个比较常用的就是隐藏某个属性`@ApiHideProperty()`，它常常和`@ApiProperty()`一起使用。

如果你还想了解更多，可以参考官方文档：<https://docs.nestjs.com/openapi/decorators>

## 读取注释配置

该配置在`nest-cli.json`文件内，具体如下：

```json
{
 "$schema": "https://json.schemastore.org/nest-cli",
 "collection": "@nestjs/schematics",
 "sourceRoot": "src",
 "compilerOptions": {
  "deleteOutDir": true,
  "plugins": [
   {
    "name": "@nestjs/swagger",
    "options": {
     "classValidatorShim": true,
     "introspectComments": true
    }
   }
  ]
 }
}
```

没啥必要直接用项目配置好的就行了。

参考文档：<https://docs.nestjs.com/openapi/cli-plugin>
