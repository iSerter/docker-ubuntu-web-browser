module.exports = {
    apps: [
      {
        name: 'api-server',
        script: './src/index.js',
        watch: true,
      },
      {
        name: 'browser-service',
        script: './src/browser-service.js',
        watch: true,
      },
    ],
  };