# 部署指南

## 网站已准备就绪！

### 项目结构
```
anniversary-website/
├── app/                    # 所有页面
│   ├── intro/             # 开场对话页
│   ├── page.tsx           # 首页
│   ├── timeline/          # 时间线
│   ├── gallery/           # 照片墙
│   ├── video/             # 视频页
│   ├── map/               # 地图足迹
│   ├── diary/             # 私密日记
│   ├── future/            # 愿望清单
│   ├── achievements/      # 成就系统
│   ├── stats/             # 数据统计
│   └── admin/             # 管理后台
├── components/            # 组件
├── lib/                   # 工具函数
├── dist/                  # 构建输出（部署此文件夹）
└── SPEC.md               # 技术规范文档
```

### 部署方式

#### 方式 1：Vercel 官网部署（推荐，最简单）

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 注册/登录账号（可用 GitHub 账号）

2. **创建新项目**
   - 点击 "Add New Project"
   - 选择 "Import from Git" 或直接上传

3. **上传 dist 文件夹**
   - 方式 A：将 `dist` 文件夹压缩为 zip，拖拽上传
   - 方式 B：使用 Vercel CLI（见下方）

4. **完成部署**
   - Vercel 会自动分配域名（如 `xxx.vercel.app`）
   - 可以自定义域名

#### 方式 2：Vercel CLI 部署

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署 dist 文件夹
cd dist
vercel --prod
```

#### 方式 3：其他静态托管

可以将 `dist` 文件夹部署到：
- GitHub Pages
- Netlify
- Cloudflare Pages
- 阿里云 OSS
- 腾讯云 COS

### 部署前需要做的

1. **修改纪念日日期**
   - 打开 `lib/utils.ts`
   - 修改 `ANNIVERSARY_DATE` 为你实际的纪念日

2. **准备素材**
   - 照片：上传到图床（如 sm.ms），获取 URL
   - 视频：上传到 B站/优酷，获取嵌入链接
   - 在管理后台 (`/admin`) 添加内容

3. **自定义内容**
   - 修改日记内容（`app/diary/page.tsx`）
   - 修改愿望清单（`app/future/page.tsx`）
   - 修改成就（`app/achievements/page.tsx`）

### 部署后访问

- 默认域名：`https://你的项目名.vercel.app`
- 开场页：`/intro`
- 首页：`/`
- 管理后台：`/admin`

### 注意事项

1. **地图功能**：需要配置 Mapbox/Google Maps API Key
2. **图片**：使用图床服务存储图片
3. **数据**：所有数据存储在 JSON 文件中，可随时修改

### 需要帮助？

如有问题，可以：
1. 查看 `SPEC.md` 技术规范文档
2. 访问 Next.js 官方文档
3. 查看 Vercel 官方文档

---

祝苏子钦 & 李丹 恋爱一周年快乐！💕
