# Script para iniciar la aplicación Angular

Write-Host "🚀 Iniciando aplicación Angular..." -ForegroundColor Cyan
Write-Host ""

# Navegar a la carpeta del proyecto
Set-Location -Path "C:\Users\diego.porta\Documents\TEST_SPA\jeje"

# Verificar que node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Iniciar el servidor de desarrollo
Write-Host "✅ Iniciando servidor de desarrollo..." -ForegroundColor Green
Write-Host "📍 La aplicación estará disponible en: http://localhost:4200" -ForegroundColor Cyan
Write-Host "🔄 Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

ng serve --open

