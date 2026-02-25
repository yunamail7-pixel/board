import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cqeeyydmesybdfloyosw.supabase.co'
const supabaseAnonKey = 'sb_publishable_mbCBYh3vfV-a7KXaBV8sUg_7tSof0So'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
