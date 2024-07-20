# ease-change-backend

## git分支规范

以下是常见的 Git 分支命名规范

- main/master：主分支，用于发布稳定版本的代码，不能直接在该分支上进行开发。

- develop：开发分支，用于进行日常开发，所有的 feature 分支都从该分支创建，也是最终合并到 main/master 分支的来源。

- feature/{feature_name}：功能分支，用于开发新功能或修复 bug。功能分支的命名一般以 feature/ 开头并接上功能名称或 bug 编号。

- hotfix/{issue_number}：修补分支，用于紧急修复问题，一般从 main/master 分支创建。修补分支的命名一般以 hotfix/ 开头并接上问题编号。

- release/{version_number}：预发布分支，用于进行发布前的测试和准备工作。预发布分支的命名一般以 release/ 开头并接上版本号。

命名规范可以根据团队的实际情况做出调整，但应该保证命名规范具有可读性和清晰性。

## 环境变量

开发环境请将`.env.example`文件修改为`.env.development`使用。

```env
# 模式
NODE_ENV="development"
```

生产环境请将`.env.example`文件修改为`.env.production`使用。

```env
# 模式
NODE_ENV="production"
```
