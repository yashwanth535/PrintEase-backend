const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://bkdbwbndgtxnsvrlvept.supabase.co"; // Replace with your Supabase URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrZGJ3Ym5kZ3R4bnN2cmx2ZXB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzM2ODEyNywiZXhwIjoyMDY4OTQ0MTI3fQ.Nl9yENQalc4Lp5XtES6TiOaAGlQHLEefqdBMzJQcHA0";
const supabase = createClient(supabaseUrl, supabaseKey);
module.exports = supabase;
