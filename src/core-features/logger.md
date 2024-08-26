# 日志管理

在Node中日志的记录有传统的日志管理模块如winston，我个人也用过，但是相对来说有些麻烦，第一是需要自己去手动填写需要记录的内容，第二是插件自身的配置繁琐，经常回头就忘了怎怎么使用。

在比对了一些日志插件后，我选择了[Pino](https://github.com/pinojs/pino)作为日志管理工具。

第一是它的NestJS插件直接对接了NestJS的日志系统，第二是它的配置简单，不需要太多的配置项就可以使用。

当然，pino也有很蛋疼的地方，就是它的日志文件名没法自定义，他不能像winston那样可以根据日期自动生成日志文件名，这点是挺难受的，但是它的默认配置实在是太适合新手了，我根本不需要告诉它具体记录哪些内容，它自己会记录很多东西。

就这点，让我觉得pino真的很好用，因为作为一个入门级的全栈开发，我们往往不太明确需要记录哪些日志内容，如果全靠自己定制，肯定会有漏记的情况，我个人使用winston碰到了好几次在查看日志的时候没有找到自己想要的东西，pino则没有这个烦恼。

## 记录日志

这里以`RequestService`为例，记录请求日志。

```typescript
// RequestService.ts
import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";

@Injectable()
export class RequestService {
 private readonly logger = new Logger(RequestService.name);
 private axiosInstance: AxiosInstance;

 constructor() {
  this.initAxios();
 }

 /** 初始化axios */
 private initAxios() {
  this.axiosInstance = axios.create({
   timeout: 30 * 1000 // 30s
  });

  // 请求前拦截器
  this.axiosInstance.interceptors.request.use((config) => {
   // 日志
   this.logger.log(config, "请求准备发送");
   return config;
  });

  // 响应拦截器
  this.axiosInstance.interceptors.response.use(
   (response) => {
    // 日志
    this.logger.log(response, "请求成功响应");
    // 根据项目情况做解包处理
    return response.data;
   },
   (error) => {
    // 请求被取消
    if (axios.isCancel(error)) {
     this.logger.log(`请求被取消: ${error.message}`);
     return Promise.reject(new InternalServerErrorException(error.message));
    }

    // 日志
    this.logger.error(error, `请求发生错误`);

    // AxiosError
    if (error instanceof AxiosError) {
     /**
      * 异常响应
      * {
      *  "status": "error",
      *  "user_id": model.user_id,
      *  "task_id": model.task_id,
      *  "message": "error message"
      * }
      */
     return Promise.reject(
      new InternalServerErrorException(error.response?.data?.message ?? error.message)
     );
    }

    // Error
    if (error instanceof Error) {
     return Promise.reject(new InternalServerErrorException(error.message));
    }

    // 其他
    return Promise.reject(new InternalServerErrorException("未知错误"));
   }
  );
 }

 /** 通用请求 */
 request<T>(options: AxiosRequestConfig): Promise<T> {
  return this.axiosInstance(options);
 }
}

```

我们需要先从`"@nestjs/common"`引入`Logger`类，因为pino已经代理了NestJS的日志系统，所以我们可以直接引入Nest提供的Logger。

引入后在服务中new出Logger实例，需要传入一个参数，常见的就是当前类的类名，这个参数会在日志的`context`字段中显示，方便我们区分日志的来源。

如果你只需要记录文字消息，可以直接这样：

```typescript
this.logger.log("Hello, world!");
```

如果你需要记录对象，可以这样：

```typescript
this.logger.log({ name: "John", age: 30 }, "错误信息");
```

对象必须作为第一个参数传入，第二个参数是可选的，用于描述日志的具体内容。

## 日志内容示例

```log
{"level":30,"time":"2024-08-26T13:09:53","pid":29832,"hostname":"DESKTOP-C5IR9G5","req":{"id":1,"method":"GET","url":"/api","query":{},"params":{},"headers":{"host":"localhost:3000","connection":"keep-alive","cache-control":"max-age=0","sec-ch-ua":"\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"","sec-ch-ua-mobile":"?0","sec-ch-ua-platform":"\"Windows\"","dnt":"1","upgrade-insecure-requests":"1","user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36","accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7","sec-fetch-site":"none","sec-fetch-mode":"navigate","sec-fetch-user":"?1","sec-fetch-dest":"document","accept-encoding":"gzip, deflate, br, zstd","accept-language":"zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,de;q=0.6,en-AU;q=0.5,sw;q=0.4,my;q=0.3","if-none-match":"W/\"35-hlfSjEhGaDmWCNiGmPC4EufOiZ8\""},"remoteAddress":"::1","remotePort":60715},"context":"HTTP","res":{"statusCode":304,"headers":{"cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"cross-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=15552000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"SAMEORIGIN","x-permitted-cross-domain-policies":"none","x-xss-protection":"0","access-control-allow-origin":"*","etag":"W/\"35-hlfSjEhGaDmWCNiGmPC4EufOiZ8\""}},"responseTime":7,"msg":"request completed"}
```

使用json格式化后：

```json
{
    "level": 30,
    "time": "2024-08-26T13:09:53",
    "pid": 29832,
    "hostname": "DESKTOP-C5IR9G5",
    "req": {
        "id": 1,
        "method": "GET",
        "url": "/api",
        "query": {},
        "params": {},
        "headers": {
            "host": "localhost:3000",
            "connection": "keep-alive",
            "cache-control": "max-age=0",
            "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "dnt": "1",
            "upgrade-insecure-requests": "1",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "sec-fetch-site": "none",
            "sec-fetch-mode": "navigate",
            "sec-fetch-user": "?1",
            "sec-fetch-dest": "document",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,de;q=0.6,en-AU;q=0.5,sw;q=0.4,my;q=0.3",
            "if-none-match": "W/\"35-hlfSjEhGaDmWCNiGmPC4EufOiZ8\""
        },
        "remoteAddress": "::1",
        "remotePort": 60715
    },
    "context": "HTTP",
    "res": {
        "statusCode": 304,
        "headers": {
            "cross-origin-opener-policy": "same-origin",
            "cross-origin-resource-policy": "cross-origin",
            "origin-agent-cluster": "?1",
            "referrer-policy": "no-referrer",
            "strict-transport-security": "max-age=15552000; includeSubDomains",
            "x-content-type-options": "nosniff",
            "x-dns-prefetch-control": "off",
            "x-download-options": "noopen",
            "x-frame-options": "SAMEORIGIN",
            "x-permitted-cross-domain-policies": "none",
            "x-xss-protection": "0",
            "access-control-allow-origin": "*",
            "etag": "W/\"35-hlfSjEhGaDmWCNiGmPC4EufOiZ8\""
        }
    },
    "responseTime": 7,
    "msg": "request completed"
}
```

可以看到，日志中包含了请求的相关信息，包括请求的url、method、headers、query、params等。

不同的日志记录信息是不同的，但是总体来说pino帮我们记录了很多有用的信息，而且还不需要自己手动配置记录的内容有哪些。

## 日志等级

pino有六个等级的日志：

* fatal (60): 严重错误，应用程序将会退出
* error (50): 错误事件
* warn (40): 警告信息
* info (30): 常规信息（默认）
* debug (20): 调试信息
* trace (10): 跟踪信息

方法对应关系如下：

```typescript
this.logger.fatal("致命错误");
this.logger.error("错误事件");
this.logger.warn("警告信息");
this.logger.info("常规信息");
this.logger.debug("调试信息");
this.logger.trace("跟踪信息");
```

默认情况下，在开发模式`NODE_ENV="development"`时，pino会记录`trace`及以上级别的日志，在生产模式下只会记录`info`及以上级别的日志。

如果你需要修改这个行为，找到`src\shared\shared.module.ts`模块的`LoggerModule`，自行调整`level`属性。

## 日志文件

在开发模式下，pino会将日志输出到控制台，而在生产模式下，日志会输出到文件中。

具体配置如下：

```typescript
{
  target: "pino-roll",
  options: {
  file: joinRootPath("/logs/pino"),
  frequency: "daily",
  size: "10M",
  mkdir: true,
  extension: ".log",
  }
}
```

如果没有什么特殊需求，默认这套配置就可以了。

它会将日志输出到项目下的logs目录，文件名为`pino.1.log`，如果文件大小超过10M，会自动生成新的日志文件`pino.2.log`，以此类推。

然后文件会进行一个自动流转，`frequency: "daily"`表示每天生成一个新的日志文件，如果size超出大小也会自动生成新的日志文件。

## 日志配置

pino的配置项比较简单，它写在`src\shared\shared.module.ts`模块里的`LoggerModule`中，如下：

```typescript
LoggerModule.forRoot({
   pinoHttp: {
    /**
     * fatal (60): 严重错误，应用程序将会退出
     * error (50): 错误事件
     * warn (40): 警告信息
     * info (30): 常规信息（默认）
     * debug (20): 调试信息
     * trace (10): 跟踪信息
     */
    level: isDev ? "trace" : "info",
    customProps: (_req, _res) => ({
     context: "HTTP"
    }),
    timestamp: () => `,"time":"${getLogTime()}"`,
    transport: isDev
     ? {
       target: "pino-pretty",
       options: {
        singleLine: true
       }
      }
     : {
       target: "pino-roll",
       options: {
        file: joinRootPath("/logs/pino"),
        frequency: "daily",
        size: "10M",
        mkdir: true,
        extension: ".log"
       }
      }
   }
  })
```

`pino-pretty`用于在开发模式下输出日志到控制台，`pino-roll`用于在生产模式下输出日志到文件。
