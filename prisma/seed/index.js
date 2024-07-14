"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.user.create({
        data: {
            nickname: "测试用户"
        }
    });
    console.log("数据填充完成");
}
main();
//# sourceMappingURL=index.js.map