require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testSupabaseConnection() {
  console.log("=== Supabase Connection & Storage Diagnostics ===");
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucketName = process.env.SUPABASE_PDF_BUCKET || "digital-pdfs";

  console.log(`URL: ${url ? url : '(NOT SET)'}`);
  console.log(`Service Role Key: ${serviceKey ? (serviceKey.slice(0, 10) + '...') : '(NOT SET)'}`);
  console.log(`Target PDF Bucket: ${bucketName}`);

  if (!url || url === 'your_supabase_url' || !url.startsWith('http')) {
    console.error("\n❌ STATUS: Unconfigured / Invalid URL.");
    console.log("Please replace 'NEXT_PUBLIC_SUPABASE_URL=your_supabase_url' in your .env file with your actual Supabase project URL (e.g., https://xyzcompany.supabase.co).");
    process.exit(1);
  }

  if (!serviceKey || serviceKey === 'your_service_role_key') {
    console.error("\n❌ STATUS: Unconfigured Service Role Key.");
    console.log("Please replace 'SUPABASE_SERVICE_ROLE_KEY=your_service_role_key' in your .env file with your actual Supabase service_role key from Project Settings > API.");
    process.exit(1);
  }

  try {
    const supabase = createClient(url, serviceKey, {
      auth: { persistSession: false }
    });

    console.log("\nAttempting connection to Supabase Storage...");

    // 1. List storage buckets
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

    if (bucketError) {
      console.error("\n❌ CONNECTION FAILED:", bucketError.message);
      console.log("Details:", bucketError);
      process.exit(1);
    }

    console.log("\n✅ CONNECTION SUCCESSFUL! Connected to Supabase Project.");
    console.log(`Found ${buckets ? buckets.length : 0} storage bucket(s):`);
    
    if (buckets && buckets.length > 0) {
      buckets.forEach(b => {
        console.log(` - ${b.name} (${b.public ? 'Public' : 'Private'})`);
      });
    } else {
      console.log(" - (No storage buckets created yet)");
    }

    // Check if configured PDF bucket exists
    const pdfBucket = buckets.find(b => b.name === bucketName);

    if (pdfBucket) {
      console.log(`\n✅ Bucket '${bucketName}' EXISTS and is accessible.`);
      // List files inside bucket
      const { data: files, error: listError } = await supabase.storage.from(bucketName).list();
      if (!listError && files) {
        console.log(`Files in '${bucketName}': ${files.length} item(s)`);
        files.slice(0, 5).forEach(f => console.log(`   └─ ${f.name} (${f.metadata ? f.metadata.size : ''} bytes)`));
      }
    } else {
      console.warn(`\n⚠️  Bucket '${bucketName}' does NOT exist yet.`);
      console.log(`Creating bucket '${bucketName}' now...`);
      
      const { data: createData, error: createError } = await supabase.storage.createBucket(bucketName, {
        public: false,
        allowedMimeTypes: ['application/pdf'],
      });

      if (createError) {
        console.warn(`Could not automatically create bucket: ${createError.message}`);
        console.log(`Please manually create a bucket named '${bucketName}' in your Supabase Dashboard -> Storage.`);
      } else {
        console.log(`✅ Successfully created private bucket '${bucketName}' in Supabase!`);
      }
    }

  } catch (err) {
    console.error("\n❌ Unexpected Error connecting to Supabase:", err.message);
    process.exit(1);
  }
}

testSupabaseConnection();
