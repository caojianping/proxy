module.exports = {
    apps: [
        {
            name: 'proxy',
            script: './dist/main.js',
            watch: true,
            watch_ignore: ['./node_modules', './logs'],
            // 开发环境
            env_development: {
                NODE_ENV: 'development',
            },
            // 生产环境
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],
};
