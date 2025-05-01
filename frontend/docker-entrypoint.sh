#!/bin/sh
set -e

# 检查环境变量是否为开发环境
if [ "$NODE_ENV" = "development" ]; then
  echo "Running in development mode with hot reload for static assets"
  
  # 确保src目录权限正确
  if [ -d "/usr/share/nginx/html/src" ]; then
    chmod -R 755 /usr/share/nginx/html/src
  fi
  
  # 确保index.html引用的路径是正确的
  if [ -f "/usr/share/nginx/html/index.html" ]; then
    echo "Checking index.html references..."
    # 无需替换，因为我们已经修改了路径为绝对路径 /src/...
  fi
fi

# 执行CMD参数
exec "$@" 