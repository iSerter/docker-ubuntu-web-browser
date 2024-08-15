module.exports = {
    apps: [
      {
        name: 'api-server',
        script: './src/index.js',
        watch: true,
      },
      {
        name: 'queue-workers',
        script: './src/queue-workers.js',
        watch: true,
      },
    ],
  };