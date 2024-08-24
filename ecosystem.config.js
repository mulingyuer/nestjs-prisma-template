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
