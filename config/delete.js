import supabase from './supabase.config.js';

const run = async () => {
  const bucket = 'printease';
  const rawPath = '/1754331430796-YASHWANTH-MUNIKUNTLA_odf.pdf';

  // Clean the path in case of accidental double slashes
  const cleanedPath = rawPath.replace(/^\/+/, ''); // Removes leading slashes

  const { data, error } = await supabase
    .storage
    .from(bucket)
    .remove([cleanedPath]);

  if (error) {
    console.error('❌ Failed to delete file:', error.message);
  } else {
    console.log(`✅ File deleted successfully from bucket '${bucket}': ${cleanedPath}`);
  }
};

run();
