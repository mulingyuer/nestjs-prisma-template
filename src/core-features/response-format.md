## 接口响应格式

所有正常的接口请求都会通过统一的拦截器`ResponseInterceptor`做统一的响应格式处理，统一返回格式为：

```json
{
  "code": 200,
  "message": "成功",
  "data": null
}
```

拦截器路径：`src\common\interceptors\response\response.interceptor.ts`

拦截器在`shared`模块中全局注册，所有模块都可以使用。

拦截器最终会调用`Result.success()`静态方法，生成统一的响应对象。

## 状态码

遵循RESTful API规范，post请求的状态码为201，但是我们在业务中一般都是默认200为成功，所以拦截器会默认将post的状态码201改为200。

`ResponseInterceptor`实际上它只会处理成功的请求，所以它的code字段永远都是200，message为成功。

## 示例

```typescript
// app.controller.ts
import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { Public } from "@/common/decorators";

@Controller()
export class AppController {
 constructor(private readonly appService: AppService) {}

 @Get()
 @Public()
 getHello(): string {
  return this.appService.getHello();
 }
}
```

```typescript
// app.service.ts
import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
 getHello(): string {
  return "Hello World!";
 }
}
```

在具体的业务中，我们return具体的返回值即可，code和message会自动处理。

```json
{
  "data": "Hello World!",
  "message": "成功",
  "code": 200
}
```

## 自定义响应格式

事实上你也可以return一个符合上面返回格式的对象。

```typescript
// app.service.ts
import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
 getHello(): string {
  return {
    code: 200,
    message: "成功",
    data: "Hello World!"
  }
 }
}
```

这种情况我也是有做兼容的，但是不建议这么做，不利于后续维护。
