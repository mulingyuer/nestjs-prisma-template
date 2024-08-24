# 项目介绍

在学习 NestJS 和 Prisma 的过程中，随着项目的增多，发现一个入门级的项目模板是很有帮助的，首先我们不需要花太多时间来重复造轮子，并且基于官方文档的封装，也可以很快的上手。

而一个入门的项目模板，对于新手来说，简直就是最好的一个学习工具，当然如果你是老手，也不用担心，你也可以根据自己的需求进行定制。

## 项目特性

- **统一错误异常处理：** 支持自定义 code、message、status 属性；
- **统一接口响应格式：** 通过全局序列化处理，可过滤掉一些字段，也可格式化字段属性；
- **便捷的日志管理：** 集成 pino 日志库，支持日志文件、控制台的输出切换；
- **集成 Swagger：** 提供可视化 API 文档；
- **封装 DTO 校验管道：** 结合统一错误异常处理，实现便捷的参数校验；
- **封装常用的图片上传功能：** 支持单图、图片组、多图上传（文件上传可以基于此自行封装）；
- **便捷的环境变量管理：** 支持指定自定义环境变量文件；
- **封装 JWT 鉴权处理：** 默认全局鉴权，配合`Public`装饰器可实现无需鉴权的接口；
- **封装全局请求内容类型校验：** 默认请求头`Content-Type: application/json`，可自定义控制器的接口请求类型；
- **封装全局 Axios 请求服务：** 由于后端对接第三方服务返回的值类型不统一，如有需要，可基于此封装自定义请求服务；
- **集成 Prisma 数据库 ORM：** 支持数据填充模式切换，全局 `PrismaService`，完善的数据库日志记录和初始化连接异常处理；
- **基本安全配置：** 包括跨域设置、头信息安全处理等；
- **模块化架构：** 拆分业务模块（modules）、公共模块（shared）、公共工具等（common）；
- **便捷的工具函数封装：** 如获取项目根目录、项目目录地址拼接、环境变量校验等；
- **一键生成入口文件：** 通过预设脚本命令一键生成入口文件`index.ts`；
- **常见命令脚本封装：** 过`npm-run-all2`实现多命令自由组合执行；
- **配置常用的 EsLint 规则和 Prettier 代码格式化规则：** 确保代码风格统一；

## 项目结构

```bash
nestjs-prisma-template
├─ prisma
│  ├─ migrations
│  ├─ schema.prisma
│  └─ seed
│     └─ index.ts
├─ scripts
├─ src
│  ├─ app.controller.spec.ts
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ common
│  │  ├─ decorators
│  │  ├─ dto
│  │  ├─ entities
│  │  ├─ enum
│  │  ├─ filters
│  │  ├─ guards
│  │  ├─ http-exception
│  │  ├─ interceptors
│  │  ├─ pipes
│  │  └─ result-class
│  ├─ main.ts
│  ├─ modules
│  │  └─ auth
│  ├─ shared
│  │  ├─ custom-http-exception
│  │  ├─ prisma
│  │  ├─ services
│  │  │  └─ request
│  │  ├─ shared.module.ts
│  │  └─ upload
│  ├─ swagger
│  │  └─ index.ts
│  └─ utils
├─ .eslintrc.js
├─ .gitattributes
├─ .gitignore
├─ .prettierignore
├─ .prettierrc.json
├─ barrelsby.json
├─ nest-cli.json
├─ package.json
├─ pnpm-lock.yaml
├─ README.md
├─ tsconfig.build.json
└─ tsconfig.json
```
