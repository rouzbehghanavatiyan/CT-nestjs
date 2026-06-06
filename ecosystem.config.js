module.exports = {
  apps: [
    {
      name: "nova-backend",
      cwd: "/var/www/nova",
      script: "dist/main.js",
      instances: 1,             
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        PORT: 4000             
      }
    }
  ]
}

