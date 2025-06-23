const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://qgygmtoblolchqiblvgj.supabase.co"; // Replace with your Supabase URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFneWdtdG9ibG9sY2hxaWJsdmdqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjAzOTIwMywiZXhwIjoyMDU3NjE1MjAzfQ.Ll2iLB6NN8X_QhmjAhSwIuROrNsXZ-ZT-RVZqOZ4Pgk"; // Replace with your Supabase anon key

const supabase = createClient(supabaseUrl, supabaseKey);
module.exports = supabase;
