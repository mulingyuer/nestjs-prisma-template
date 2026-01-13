# nestjs-prisma-template

[![zread](https://img.shields.io/badge/Ask_Zread-_.svg?style=flat&color=00b0aa&labelColor=000000&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQuOTYxNTYgMS42MDAxSDIuMjQxNTZDMS44ODgxIDEuNjAwMSAxLjYwMTU2IDEuODg2NjQgMS42MDE1NiAyLjI0MDFWNC45NjAxQzEuNjAxNTYgNS4zMTM1NiAxLjg4ODEgNS42MDAxIDIuMjQxNTYgNS42MDAxSDQuOTYxNTZDNS4zMTUwMiA1LjYwMDEgNS42MDE1NiAxMS4wMzk5VjEzLjc1OTlDMS42MDE1NiAxNC4xMTM0IDEuODg4MSAxNC4zOTk5IDIuMjQxNTYgMTQuMzk5OUg0Ljk2MTU2QzUuMzE1MDIgMTQuMzk5OSA1LjYwMTU2IDE0LjExMzQgNS42MDE1NiAxMy43NTk5VjExLjAzOTlDNS42MDE1NiAxMC42ODY0IDUuMzE1MDIgMTAuMzk5OSA0Ljk2MTU2IDEwLjM5OTlaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik0xMy43NTg0IDEuNjAwMSAxNC4zOTk5IDIuMjQxNTYgMTQuMzk5OUg0Ljk2MTU2QzUuMzE1MDIgMTQuMzk5OSA1LjYwMTU2IDE0LjExMzQgNS42MDE1NiAxMy43NTk5VjExLjAzOTlDNS42MDE1NiAxMC42ODY0IDUuMzE1MDIgMTAuMzk5OSA0Ljk2MTU2IDEwLjM5OTlaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik00IDEyTDEyIDRMNCAxMloiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik00IDEyTDEyIDQiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K&logoColor=ffffff)](https://zread.ai/mulingyuer/nestjs-prisma-template)

这是一个基于 **NestJS** 和 **Prisma** 的高效后端项目模板，旨在帮助开发者快速搭建稳健、可扩展的后端服务。

AI 生成的文档：[《nestjs-prisma-template》](https://zread.ai/mulingyuer/nestjs-prisma-template)

## 🚀 特性

- **NestJS v11**: 采用最新的 NestJS 框架。
- **Prisma ORM**: 强大的强类型 ORM，支持多种数据库。
- **TypeScript**: 完整的类型安全支持。
- **Swagger**: 自动配置 API 文档，方便前后端协作。
- **Pino**: 集成高性能日志记录器。
- **Argon2**: 更安全的密码哈希加密。
- **JWT**: 内置身份验证支持。
- **Validation**: 简单的参数校验，基于 `class-validator`。
- **Configuration**: 灵活的环境变量管理。

## 🛠️ 技术栈

- **框架**: [NestJS](https://nestjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **数据库支持**: MariaDB / MySQL (可通过 Prisma 轻松切换)
- **工具库**: Axios, RxJS, Cache Manager, ioredis

## 📦 快速开始

### 1. 环境安装

确保你已经安装了 [Node.js](https://nodejs.org/) (建议 v18+) 和 [pnpm](https://pnpm.io/)。

### 2. 安装依赖

```bash
pnpm install
```

### 3. 环境配置

开发环境请将 `.env.example` 文件修改为 `.env.development` 使用。
生产环境请将 `.env.example` 文件修改为 `.env.production` 使用。

```env
# 核心模式
NODE_ENV="development"

# 数据库连接
DATABASE_URL="mysql://user:password@localhost:3306/dbname"
```

### 4. 数据库迁移

```bash
# 生成 Prisma Client
pnpm run prisma:generate

# 执行开发环境迁移
pnpm run prisma:migrate
```

### 5. 启动项目

```bash
# 开发模式
pnpm run start:dev

# 调试模式
pnpm run start:debug

# 生产模式构建并运行
pnpm run build:all
# 有需要你可能要在首次运行一次数据填充
npx dotenv -e .env.production prisma db seed
# 启动
pnpm run start:prod
```

## 📖 API 文档

项目运行后，可以在浏览器中访问 Swagger 文档：
`http://localhost:3000/docs` (默认端口)

## 🌿 Git 分支规范

以下是项目建议的 Git 分支命名规范：

- **main/master**：主分支，用于发布稳定版本的代码，不能直接在该分支上进行开发。
- **develop**：开发分支，用于进行日常开发，所有的 feature 分支都从该分支创建，也是最终合并到 main/master 分支的来源。
- **feature/{feature_name}**：功能分支，用于开发新功能或修复 bug。功能分支的命名一般以 `feature/` 开头并接上功能名称或 bug 编号。
- **hotfix/{issue_number}**：修补分支，用于紧急修复问题，一般从 main/master 分支创建。修补分支的命名一般以 `hotfix/` 开头并接上问题编号。
- **release/{version_number}**：预发布分支，用于进行发布前的测试 and 准备工作。预发布分支的命名一般以 `release/` 开头并接上版本号。

> 命名规范可以根据团队的实际情况做出调整，但应该保证命名规范具有可读性和清晰性。

## 📜 许可证

UNLICENSED
