# 打包部署

本节将介绍如何将 NestJS 项目部署到服务器上。

## 项目打包

部署之前我们先将项目进行打包，目前打包分两个派系，一种是使用 webpack 打包，另一种是使用 Nest CLI 打包。

webpack打包会将所有代码（包括依赖项）打包到js文件中，类似于我们SPA项目的打包方式，但是这种方式打包配置上官方并没有文档，所以不推荐使用，大佬可以自行研究。

Nest CLI 打包会将项目编译成js文件，他们依旧会依赖于node_modules文件夹，所以在服务器上你也需要安装依赖，然后通过PM2来启动应用。

打包之前我们需要确认存在生产使用的环境变量文件：`.env.production`

文件存在并且配置正确后，我们可以执行以下命令进行安装依赖：

```bash
pnpm install
```

然后执行打包命令：

```bash
pnpm build:all
```

该命令会先读取`.env.production`文件，然后运行prisma的同步数据库命令进行数据库同步和生成prisma client，然后使用Nest CLI进行编译打包。

打包完成后，我们会在`dist`文件夹下看到编译后的js文件。

## 安装 PM2

在服务器上安装Node之后，我们需要安装 PM2 来运行管理 NestJS 应用。

```bash
npm install pm2 -g
```

安装完毕后我们需要将PM2设置成持久化启动，这样即使服务器重启，PM2也会自动启动应用。

```bash
pm2 startup
```

不同的系统可能返回的提示不同，大家根据自己的实际情况进行操作即可。

具体内容可以参考官方文档：<https://pm2.keymetrics.io/docs/usage/startup/>

## 生成PM2配置文件

我们需要在项目根目录下创建一个`ecosystem.config.js`文件，在项目目录下执行以下命令：

```bash
pm2 init simple
```

此时他会在项目根目录下生成一个`ecosystem.config.js`文件，我目前提供了一个示例文件，大家可以根据自己的实际情况进行修改。

```javascript
module.exports = {
 apps: [
  {
   name: "nest-prisma-template",
   exec_mode: "cluster", //开启集群
   instances: "2", // 需要启动的实例数量，max是pm2自动配置，如果设置为max一般会根据cpu核数来设置
   max_memory_restart: "512M", // 内存限制重新加载
   autorestart: true, // 发生异常的情况下自动重启
   min_uptime: "60s", // 应用运行少于时间被认为是异常启动
   max_restarts: 30, // 最大异常重启次数
   restart_delay: 60, // 异常重启情况下，延时重启时间
   script: "./dist/src/main.js",
   env_production: {
    /** 模式 */
    NODE_ENV: "production"
   }
  }
 ]
};
```

其中`env_production`配置了NODE_ENV用于指定当前运行环境模式和环境文件。

`script`用于指定启动的js文件，这里我们指定的是编译后的js文件。

`name`也挺重要的，我们使用了集群，可以通过name来快速指定集群应用，方便管理（不可重名）。

## 启动应用

在项目根目录下执行以下命令启动应用：

```bash
pm2 start ecosystem.config.js --env production
```

这样就会启动应用并使用`env_production`配置的环境变量。

如果使用的是我默认文件，那么它就会启动2个实例应用。

## 查看应用列表

通过列表我们可以查看当前运行的应用，以及应用的状态。

```bash
pm2 list
```

输出示例：

```bash
┌────┬─────────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name                    │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼─────────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0  │ nest-prisma-template    │ default     │ 0.0.1   │ cluster │ 34332    │ 5m     │ 0    │ online    │ 0%       │ 86.6mb   │ mul… │ disabled │
│ 1  │ nest-prisma-template    │ default     │ 0.0.1   │ cluster │ 34756    │ 5m     │ 0    │ online    │ 0%       │ 86.2mb   │ mul… │ disabled │
└────┴─────────────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

## 停止应用

通过以下命令停止应用：

```bash
pm2 stop nest-prisma-template
```

`nest-prisma-template`是我们在`ecosystem.config.js`文件中配置的应用名称。

## 域名访问

由于Node本身是没法绑定域名的，所以我们如果想通过域名访问，还得借助Nginx来处理，这里就不再赘述了，大家可以自行搜索相关资料。

一般公司环境下，交给专门的运维人员处理就行。
