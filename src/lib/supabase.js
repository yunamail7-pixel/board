import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eeyydmesybdfloyosw.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_mbCBYh3vfV-a7KXaBV8sUg_7tSof0So'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
