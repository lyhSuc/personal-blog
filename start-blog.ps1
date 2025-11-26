# 启动博客服务脚本
Write-Host "正在启动博客服务..." -ForegroundColor Yellow

# 切换到项目目录
$projectPath = "f:\Vibe Coding\personal-blog"
Set-Location $projectPath

# 启动开发服务器 (新窗口)
Write-Host "启动开发服务器..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$projectPath'; npm run dev"

# 等待服务器启动
Write-Host "等待服务器启动..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# 自动打开浏览器
Write-Host "打开浏览器..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"

Write-Host "`n✓ 博客服务已启动!" -ForegroundColor Green
Write-Host "  - 前端: http://localhost:3000" -ForegroundColor White
Write-Host "  - 后台: http://localhost:3000/admin" -ForegroundColor White
Write-Host "`n如需启动 Prisma Studio, 运行: npx prisma studio" -ForegroundColor Gray
