import { createClient } from '@supabase/supabase-js'

// 请替换为你的 Supabase 项目 URL 和 Anon Key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gcwhcjgtrnvqzqetfmlg.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdjd2hjamd0cm52cXpxZXRmbWxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NzIyMTUsImV4cCI6MjA3OTQ0ODIxNX0.pNE1dwOIL2Fzl5GhD6UAyp-nAVW268LyqSnt5YTxKcU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

