const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role Key for writing

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase URL or Key");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
