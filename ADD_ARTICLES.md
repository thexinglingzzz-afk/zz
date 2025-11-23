# 添加文章数据指南

本指南说明如何为博客添加文章数据。

## 方法一：使用 SQL 脚本（推荐）

### 添加示例文章

1. 打开 Supabase 项目仪表板
2. 进入 **SQL Editor**
3. 点击 **New query**
4. 打开项目中的 `supabase/sample-data.sql` 文件
5. 复制全部内容并粘贴到 SQL Editor
6. 点击 **Run** 执行

这将添加 6 篇示例文章：
- 3 篇技术分享类文章
- 2 篇生活随笔类文章
- 1 篇读书笔记类文章

### 添加自定义文章

你可以修改 `sample-data.sql` 文件，添加自己的文章：

```sql
INSERT INTO posts (title, content, excerpt, category_id, author, published) VALUES
(
  '你的文章标题',
  '你的文章内容，支持 Markdown 格式',
  '文章摘要（可选）',
  (SELECT id FROM categories WHERE name = '技术分享' LIMIT 1),  -- 选择分类
  '作者名称',
  true  -- true 表示已发布，false 表示草稿
);
```

## 方法二：通过 Supabase 界面

1. 在 Supabase 仪表板中，点击 **Table Editor**
2. 选择 `posts` 表
3. 点击 **Insert row** 或 **Insert** 按钮
4. 填写以下字段：
   - **title** (必填): 文章标题
   - **content** (必填): 文章内容
   - **excerpt** (可选): 文章摘要
   - **category_id** (可选): 分类 ID（从 categories 表复制）
   - **author** (可选): 作者名称，默认为 '匿名'
   - **published** (必填): 是否发布，true 或 false
5. 点击 **Save** 保存

## 方法三：通过 API（程序化添加）

如果你想要通过代码添加文章，可以使用 Supabase 客户端：

```javascript
import { supabase } from './lib/supabase'

// 首先获取分类 ID
const { data: categories } = await supabase
  .from('categories')
  .select('id, name')

const techCategory = categories.find(c => c.name === '技术分享')

// 插入文章
const { data, error } = await supabase
  .from('posts')
  .insert({
    title: '我的新文章',
    content: '文章内容...',
    excerpt: '文章摘要',
    category_id: techCategory.id,
    author: '作者名',
    published: true
  })
```

## 文章内容格式

文章内容支持以下格式：
- **纯文本**: 直接输入文本
- **Markdown**: 支持 Markdown 语法（标题、列表、代码块等）
- **HTML**: 支持 HTML 标签（前端会使用 `dangerouslySetInnerHTML` 渲染）

## 注意事项

1. **分类 ID**: 确保 `category_id` 对应的分类存在于 `categories` 表中
2. **发布状态**: `published` 为 `false` 的文章不会在前端显示
3. **内容长度**: 建议文章内容不要过长，影响加载速度
4. **特殊字符**: 如果使用 SQL 插入，注意转义单引号等特殊字符

## 查看文章

添加文章后，你可以：
1. 在 Supabase Table Editor 中查看所有文章
2. 在前端网站中查看（如果 `published = true`）
3. 访问 `/blog` 页面查看所有已发布的文章

## 更新文章

### 通过 SQL

```sql
UPDATE posts 
SET 
  title = '新标题',
  content = '新内容',
  updated_at = NOW()
WHERE id = '文章ID';
```

### 通过界面

1. 在 Table Editor 中找到要更新的文章
2. 点击文章行进行编辑
3. 修改字段后点击 **Save**

### 通过 API

```javascript
const { data, error } = await supabase
  .from('posts')
  .update({ 
    title: '新标题',
    content: '新内容'
  })
  .eq('id', '文章ID')
```

## 删除文章

### 通过 SQL

```sql
DELETE FROM posts WHERE id = '文章ID';
```

### 通过界面

1. 在 Table Editor 中找到要删除的文章
2. 点击删除按钮
3. 确认删除

**注意**: 删除文章会同时删除该文章的所有评论（因为设置了 CASCADE 删除）

