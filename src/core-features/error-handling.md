# 错误异常处理

在后端框架的设计中，错误处理通常采用 throw 抛出错误对象的方式。然后，错误对象会被全局异常捕获器捕获，并处理成统一的返回格式，再返回给客户端。

以 Koa 为例，它的洋葱模型通过在最外层的中间件捕获错误，实现统一的错误处理和响应。

同样，在 NestJS 中，也提供了统一的错误处理机制。我们可以通过全局异常过滤器来处理全局错误，确保应用程序的错误响应格式一致。

## NestJS有哪些预制错误类？

NestJS提供了一些预制的错误类，了解它们可以帮助我们在合适的场景下使用。

我之前写了一篇文章 [《Nestjs 预设的错误类大全》](https://www.mulingyuer.com/archives/973/)，想了解的同学可以参考一下。

## 全局异常过滤器

我已经封装了一个全局异常过滤器，可以帮助我们处理全局的错误。

过滤器路径：`src\common\filters\http-exception\http-exception.filter.ts`

异常过滤器在`shared`模块中进行了全局注册，shared模块最终会在`AppModule`中注册。

**目前它特殊处理了以下几种错误：**

1. NestJS 自带的 `HttpException`
2. Prisma 数据库错误
3. 自定义code错误类 `CodeHttpException`

需要注意的是，部分第三方插件可能会抛出自己的错误类，如果你想自定义message，可以就得像下面这样写：

```typescript
let message = exception.message ?? "Internal Server Error";
// 文件大小超出限制
if (message.includes("File too large")) {
  message = "文件大小超出限制";
}
```

你可以通过判断错误信息，或者判断是否是某种类型的错误，来自定义错误信息。

自定义错误信息还是有些必要的，因为默认的错误信息可能不够友好，或者不够详细。

最终从错误对象提取的信息，会作为参数传递给`Result.fail()`静态方法，生成统一的错误响应对象。

## 效果测试

我们可以在NestJS的控制器或者服务中抛出错误，来测试一下全局异常过滤器的效果。

```typescript
// app.controller.ts
import { BadRequestException, Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { Public } from "@/common/decorators";

@Controller()
export class AppController {
 constructor(private readonly appService: AppService) {}

 @Get()
 @Public()
 getHello(): string {
  throw new BadRequestException("测试异常");
  return this.appService.getHello();
 }
}
```

然后我们访问这个控制器接口，会返回一个统一的错误响应：

```json
{
  "data": null,
  "message": "测试异常",
  "code": 400
}
```

非自定义code错误类，它的code默认就是响应头的status，比如`BadRequestException`的status就是400。

## 自定义错误类

如果你频繁的抛出一些相同内容的错误，比如固定message内容的错误，没必要每次都new一个`HttpException`，可以自定义一个错误类固定message内容，然后抛出这个类。

我们在文件：`src\shared\custom-http-exception\index.ts` 中就可以export抛出自定义错误类。

```typescript
import { HttpException, HttpStatus } from "@nestjs/common";   

export class TestException extends HttpException {
  constructor(message: string = "测试异常") {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
```

定义好后就可以在控制器或者服务中抛出这个类，然后全局异常过滤器就会处理这个错误。

```typescript
// app.controller.ts
import { BadRequestException, Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { Public } from "@/common/decorators";
import { TestException } from "@/shared/custom-http-exception";

@Controller()
export class AppController {
 constructor(private readonly appService: AppService) {}

 @Get()
 @Public()
 getHello(): string {
  throw new TestException();
 }
}
```

## 自定code错误类

如果你需要自定义code错误类，比如40001代表用户不存在，40002代表密码错误，可以像下面这样定义：

```typescript
import { CodeHttpException } from "@common/http-exception";

export class UserNotExistException extends CodeHttpException {
  constructor(message: string = "用户不存在") {
    super(40001,HttpStatus.BAD_REQUEST, message);
  }
}

export class PasswordErrorException extends CodeHttpException {
  constructor(message: string = "密码错误") {
    super(40002,HttpStatus.BAD_REQUEST, message);
  }
}
```

所有的自定义code类必须继承自`CodeHttpException`，然后在构造函数中传入code、status、message。

## 扩展错误类

如果你还有更复杂的错误处理需求，比如深度定制错误类，常见的做法就是声明一个父类，然后所有的业务错误都继承这个父类，这样我们就可以在错误过滤器中通过`instanceof`来判断错误类型，做针对性的处理。

比如项目中的自定义code错误类就是声明在`src\common\http-exception`中，具体的业务类则声明在`src\shared\custom-http-exception`，这样可以让代码更加清晰。
