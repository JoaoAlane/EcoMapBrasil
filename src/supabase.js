import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wqvxjttidoxcblkfjoaf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxdnhqdHRpZG94Y2Jsa2Zqb2FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4OTU5MzIsImV4cCI6MjA5NDQ3MTkzMn0.yX70oknQXr_qWR_S5GdzaV3r2HA5D3lOyn0XKCjZzUI'

export const supabase = createClient(supabaseUrl, supabaseKey)