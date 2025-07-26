import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.supabase_url;
const supabaseKey = process.env.supabase_service_secret;//bypasses rls
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
