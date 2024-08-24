# 快速开始

由于暂时还没去研究怎么通过 cli 命令来实现模板创建项目，所以目前就是手动拉去 github 上的项目，使用主力分支`main`来使用。

**github 地址：** [nestjs-prisma-template](https://github.com/mulingyuer/nestjs-prisma-template)

拉取成功并切换到`main`分支后。

## 安装依赖

```bash
pnpm install
```

## 配置环境变量

找到`.env.example`环境变量文件，复制一份改名为`.env.development`，内容调整为自己需要的环境配置，如：

```bash
# 模式
NODE_ENV="development"
# prisma
DATABASE_URL="mysql://root:@localhost:3306/nestjs-prisma-template"
# 后端域名
BACKEND_DOMAIN="http://localhost:3000"
# 端口
PORT=3000
# 全局前缀
GLOBAL_PREFIX="/api"
# 是否启用跨域
CORS_ENABLED=true
# JWT secret
JWT_SECRET="71u04R1N5XWYn9"
# JWT expiresIn
JWT_EXPIRES_IN="7d"
# 是否启用swagger
SWAGGER_ENABLED=true
# swagger 标题
SWAGGER_TITLE="Swagger API"
# swagger 描述
SWAGGER_DESCRIPTION="Swagger API文档"
# 文件上传路径
UPLOAD_DIR="/uploads"
```

如果需要打包处理，需要创建生产环境变量：`.env.production`，操作都是一样的，只是把`NODE_ENV`改为`production`，其他配置自己根据需要调整。

## 数据库迁移

首次运行项目需要先进行数据库迁移，执行以下命令：

```bash
pnpm prisma:migrate
```

等待迁移完成，迁移过程会运行数据填充脚本，会生成一个测试用户，更多信息可以查看`prisma/seed/index.ts`文件。

## 启动项目

```bash
pnpm start:dev
```

::: tip 注意：
`start:dev`命令通过`chcp 65001`解决了 pino 在 widows 下中文乱码的问题，方便调试。
:::

## 测试项目

浏览器访问:`http://localhost:3000/api`可以看到返回的结果：

```json
{
 "data": "Hello World!",
 "message": "成功",
 "code": 200
}
```

恭喜你，项目启动成功！
