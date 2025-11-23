# Supabase 配置指南

本指南将帮助你完成 Supabase 的配置，使博客网站能够正常工作。

## 第一步：创建 Supabase 项目

1. 访问 [Supabase 官网](https://supabase.com)
2. 点击 "Start your project" 或 "Sign in" 登录
3. 点击 "New Project" 创建新项目
4. 填写项目信息：
   - **Name**: 项目名称（例如：my-blog）
   - **Database Password**: 设置数据库密码（请记住这个密码）
   - **Region**: 选择离你最近的区域（建议选择 Asia Pacific）
5. 点击 "Create new project"，等待项目创建完成（约 2 分钟）

## 第二步：获取项目凭证

1. 在 Supabase 项目仪表板中，点击左侧菜单的 **Settings**（设置）
2. 点击 **API** 选项
3. 在 **Project URL** 部分，复制你的项目 URL（格式类似：`https://xxxxx.supabase.co`）
4. 在 **Project API keys** 部分，找到 **anon public** key，点击复制按钮复制这个 key

## 第三步：创建数据库表

1. 在 Supabase 项目仪表板中，点击左侧菜单的 **SQL Editor**
2. 点击 **New query** 创建新查询
3. 打开项目中的 `supabase/schema.sql` 文件，复制全部内容
4. 将 SQL 代码粘贴到 Supabase SQL Editor 中
5. 点击 **Run** 或按 `Ctrl+Enter` 执行 SQL
6. 等待执行完成，应该会看到 "Success. No rows returned" 的提示

## 第四步：创建数据库函数

1. 在 SQL Editor 中，点击 **New query** 创建新查询
2. 打开项目中的 `supabase/functions.sql` 文件，复制全部内容
3. 将 SQL 代码粘贴到 Supabase SQL Editor 中
4. 点击 **Run** 执行 SQL

## 第五步：配置环境变量

1. 在项目根目录下，创建 `.env` 文件（如果还没有的话）
2. 复制 `.env.example` 的内容到 `.env`
3. 将以下内容替换为你的实际值：
   ```
   VITE_SUPABASE_URL=你的项目URL
   VITE_SUPABASE_ANON_KEY=你的anon key
   ```

   例如：
   ```
   VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

## 第六步：验证配置

1. 在 Supabase 仪表板中，点击左侧菜单的 **Table Editor**
2. 你应该能看到三个表：
   - `categories` - 分类表
   - `posts` - 文章表
   - `comments` - 评论表
3. 检查 `categories` 表，应该已经有 3 条示例数据

## 第七步：测试连接

1. 重启开发服务器（如果正在运行）：
   ```bash
   # 停止当前服务器（Ctrl+C）
   npm run dev
   ```
2. 在浏览器中访问 http://localhost:5173
3. 如果页面正常显示且没有错误，说明配置成功！

## 添加示例文章（可选）

如果你想添加一些测试文章，可以在 Supabase 的 Table Editor 中：

1. 点击 `posts` 表
2. 点击 **Insert row** 或 **Insert** 按钮
3. 填写以下字段：
   - **title**: 文章标题
   - **content**: 文章内容
   - **excerpt**: 文章摘要（可选）
   - **category_id**: 选择一个分类的 ID（从 categories 表中复制）
   - **author**: 作者名称
   - **published**: 设置为 `true`
4. 点击 **Save** 保存

或者使用 SQL 插入：

```sql
-- 获取一个分类 ID（先执行这个查询）
SELECT id FROM categories LIMIT 1;

-- 然后使用返回的 ID 插入文章（替换 YOUR_CATEGORY_ID）
INSERT INTO posts (title, content, excerpt, category_id, author, published)
VALUES (
  '欢迎来到我的博客',
  '这是我的第一篇博客文章。在这里我会分享技术、生活和思考。',
  '欢迎来到我的博客，这里记录着我的学习和生活。',
  'YOUR_CATEGORY_ID',  -- 替换为上面查询得到的 ID
  '博主',
  true
);
```

## 配置 Row Level Security (RLS) - 可选但推荐

为了更好的安全性，建议配置 RLS 策略。在 SQL Editor 中执行：

```sql
-- 启用 RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取已发布的文章
CREATE POLICY "任何人都可以查看已发布的文章"
ON posts FOR SELECT
USING (published = true);

-- 允许所有人读取分类
CREATE POLICY "任何人都可以查看分类"
ON categories FOR SELECT
USING (true);

-- 允许所有人查看已审核的评论
CREATE POLICY "任何人都可以查看已审核的评论"
ON comments FOR SELECT
USING (approved = true);

-- 允许任何人插入评论（但需要审核）
CREATE POLICY "任何人都可以发表评论"
ON comments FOR INSERT
WITH CHECK (true);
```

## 常见问题

### 1. 找不到 API keys
- 确保你在 **Settings > API** 页面
- 如果看不到 keys，可能需要等待项目完全创建完成

### 2. SQL 执行失败
- 检查 SQL 语法是否正确
- 确保没有遗漏任何分号
- 如果表已存在，可以忽略相关错误

### 3. 前端无法连接
- 检查 `.env` 文件是否正确创建
- 确认环境变量名称是否正确（必须以 `VITE_` 开头）
- 重启开发服务器
- 检查浏览器控制台是否有错误信息

### 4. 数据不显示
- 检查 Supabase 表中是否有数据
- 检查 `published` 字段是否为 `true`
- 查看浏览器控制台的网络请求和错误信息

## 需要帮助？

如果遇到问题，可以：
1. 查看 Supabase 官方文档：https://supabase.com/docs
2. 检查浏览器控制台的错误信息
3. 查看 Supabase 项目日志

