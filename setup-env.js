// 简单的环境变量配置辅助脚本
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envExample = `# Supabase 配置
# 请替换为你的实际值

# 你的 Supabase 项目 URL（在 Supabase 项目设置 > API 中获取）
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# 你的 Supabase Anon Key（在 Supabase 项目设置 > API 中获取）
VITE_SUPABASE_ANON_KEY=your-anon-key-here
`;

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envExample, 'utf8');
  console.log('✅ 已创建 .env 文件！');
  console.log('📝 请编辑 .env 文件，填入你的 Supabase 凭证。');
  console.log('📖 详细配置步骤请查看 SUPABASE_SETUP.md');
} else {
  console.log('⚠️  .env 文件已存在，跳过创建。');
  console.log('📖 如需重新配置，请查看 SUPABASE_SETUP.md');
}

