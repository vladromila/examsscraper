module.exports = {
  apps: [{
    name: 'ExamsScraper',
    script: 'index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
  deploy: {
    production: {
      user: 'root',
      host: '164.90.194.235',
      ref: 'origin/master',
      repo: 'https://github.com/vladromila/examsscraper.git',
      path: '/var/app/repository/',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
