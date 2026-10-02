require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testSignedUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucketName = process.env.SUPABASE_PDF_BUCKET || "meivan-art";
  const testFilePath = "animal-coloring-book-by-meivan-art.pdf.pdf";

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false }
  });

  console.log(`Generating signed download URL for file: '${testFilePath}' in bucket '${bucketName}'...`);

  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(testFilePath, 300, { download: true });

  if (error) {
    console.error("❌ Signed URL Error:", error.message);
  } else {
    console.log("✅ SIGNED URL GENERATED SUCCESSFULLY!");
    console.log("URL:", data.signedUrl);
    console.log("\nExpires in: 300 seconds (5 minutes)");
  }
}

testSignedUrl();
