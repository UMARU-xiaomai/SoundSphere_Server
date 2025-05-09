# SoundSphere - 音乐创作者社区平台

SoundSphere是一个为音乐创作者打造的在线社区平台，提供音乐分享、知识交流、资源交易和项目协作功能。

## 功能模块

### 音乐模块 (Music)
- 上传、分享和播放音乐
- 音乐封面上传
- 公开和个人音乐列表
- 点赞和播放统计

### 市场模块 (Marketplace)
- 销售音乐、样本和预设
- 产品上传、预览和封面图片
- 产品搜索和筛选
- 订单管理和产品下载

### 知识模块 (Knowledge)
- 音乐知识分享
- 文章发布和编辑(支持Markdown)
- 标签系统和搜索功能
- 文章点赞、收藏和浏览统计

### 协作模块 (Collaboration)
- 项目协作功能
- 创建和管理项目
- 成员邀请和权限管理
- 项目状态跟踪

## 技术栈

### 前端
- React
- React Router
- Axios
- TailwindCSS
- React Icons

### 后端
- Node.js
- Express
- MongoDB
- JWT认证

## 安装和运行

### 前端
```bash
cd frontend
npm install
npm start
```

### 后端
```bash
cd backend
npm install
npm start
```

## API文档

API文档位于 `/docs/api.md`

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

MIT License

## 联系我们

有任何问题或建议，请发送邮件至: support@soundsphere.com

## 功能特点

- **上传与分享**：上传原创乐曲、伴奏、采样包，以及音乐相关的教程、播客
- **可读可写**：社区维基化的"创作笔记"与"制作流程"文档，任何人都可编辑、补充与改进
- **多人协作**：基于 WebRTC 的实时多人录音与混音房间，也支持 P2P 方式进行大文件（多声道音轨）传输
- **社交与电商**：在平台内建立关注体系、评论、打赏机制，还可将作品上架为付费授权，平台抽取一定佣金
- **多端覆盖**：Web、iOS/Android App、与热门 DAW（如 Ableton、FL Studio）插件对接

## 快速开始

### 环境要求

- Docker 和 Docker Compose
- Node.js >= 14

### 安装步骤

1. 克隆仓库

```bash
git clone https://github.com/yourusername/soundsphere.git
cd soundsphere
```

2. 使用 Docker Compose 启动全栈应用

```bash
docker-compose up -d
```

3. 访问应用

- 前端界面：http://localhost:8080
- 后端 API：http://localhost:3000/api
- API 文档：http://localhost:3000/api/docs

## 开发指南

### 前端开发

前端采用纯 HTML + CSS + JavaScript 开发，没有使用前端框架，目录结构如下：

```
frontend/
├── public/          # 静态资源
├── src/
│   ├── assets/      # 图片和图标
│   ├── components/  # 组件
│   ├── pages/       # 页面脚本
│   ├── styles/      # CSS 样式
│   └── utils/       # 工具函数
```

### 后端开发

后端使用 NestJS 框架开发，目录结构如下：

```
backend/
├── src/
│   ├── auth/        # 认证模块
│   ├── user/        # 用户模块
│   ├── music/       # 音乐模块
│   ├── collaboration/ # 协作模块
│   ├── knowledge/   # 知识库模块
│   └── marketplace/ # 商城模块
```

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。

## 联系我们

- 网站：[https://soundsphere.example.com](https://soundsphere.example.com)
- 电子邮件：contact@soundsphere.example.com
