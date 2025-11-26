# 关闭博客服务脚本
Write-Host "正在关闭博客服务..." -ForegroundColor Yellow

# 关闭端口 3000 (开发服务器) 和 5555 (Prisma Studio)
@(3000, 5555) | ForEach-Object {
    $port = $_
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        $connections | ForEach-Object { 
            Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
        }
        Write-Host "✓ 已关闭端口 $port 的服务" -ForegroundColor Green
    } else {
        Write-Host "○ 端口 $port 未被占用" -ForegroundColor Gray
    }
}

Write-Host "`n所有博客服务已关闭! 🎉" -ForegroundColor Cyan
