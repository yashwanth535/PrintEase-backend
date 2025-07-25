const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv")
dotenv.config();

const supabaseUrl = process.env.supabase_url;
const supabaseKey = process.env.supabase_service_secret;//bypasses rls
const supabase = createClient(supabaseUrl, supabaseKey);
module.exports = supabase;
