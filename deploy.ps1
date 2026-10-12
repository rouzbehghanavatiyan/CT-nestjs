$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host ">>> Pulling latest code..." -ForegroundColor Cyan
git pull origin master

Write-Host ">>> Installing dependencies..." -ForegroundColor Cyan
npm install

Write-Host ">>> Building..." -ForegroundColor Cyan
npm run build

if (!(Test-Path "logs")) { New-Item -ItemType Directory -Path "logs" | Out-Null }

Write-Host ">>> Restarting app with PM2..." -ForegroundColor Cyan
pm2 startOrReload ecosystem.config.js --update-env
pm2 save

Write-Host ">>> Done." -ForegroundColor Green
pm2 status