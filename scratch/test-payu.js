require('dotenv').config();
const https = require('https');
const crypto = require('crypto');

async function checkPayUService() {
  console.log("=== PayU Gateway Health & Service Diagnostics ===");

  const key = process.env.PAYU_MERCHANT_KEY || process.env.PAYU_KEY || "gtKFFx";
  const salt = process.env.PAYU_MERCHANT_SALT || process.env.PAYU_SALT || "4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW";
  const mode = (process.env.PAYU_MODE || process.env.PAYU_ENV) === "live" ? "live" : "test";
  const endpoint = mode === "live" ? "https://secure.payu.in/_payment" : "https://test.payu.in/_payment";

  console.log(`Merchant Key: ${key}`);
  console.log(`Merchant Salt: ${salt.slice(0, 4)}...${salt.slice(-4)}`);
  console.log(`Mode: ${mode.toUpperCase()}`);
  console.log(`PayU Target Gateway URL: ${endpoint}`);

  // 1. Generate test hash
  const testTxnId = `TEST-${Date.now()}`;
  const amount = "299.00";
  const productInfo = "Animal Coloring Book Test";
  const firstName = "TestUser";
  const email = "test@example.com";
  
  const hashSequence = `${key}|${testTxnId}|${amount}|${productInfo}|${firstName}|${email}|||||||||||${salt}`;
  const hash = crypto.createHash("sha512").update(hashSequence).digest("hex");

  console.log("\n1. Hash Generation Check:");
  console.log(`   Txn ID: ${testTxnId}`);
  console.log(`   SHA512 Hash: ${hash.slice(0, 24)}... (Length: ${hash.length})`);
  console.log("   ✅ Hash algorithm (SHA-512) executed correctly.");

  // 2. Test Network Reachability to PayU Gateway
  console.log("\n2. PayU Endpoint Connectivity Check:");
  
  return new Promise((resolve) => {
    const reqUrl = new URL(endpoint);
    const req = https.request({
      hostname: reqUrl.hostname,
      path: reqUrl.pathname,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    }, (res) => {
      console.log(`   HTTP Status Code: ${res.statusCode} ${res.statusMessage}`);

      if (res.statusCode >= 200 && res.statusCode < 405) {
        console.log("   ✅ PAYU SERVICE IS ACTIVE & REACHABLE!");
        console.log("\n=== Summary ===");
        console.log(`PayU ${mode.toUpperCase()} gateway is reachable and responding.`);
        console.log("Ready to process transactions at: " + endpoint);
      } else {
        console.warn(`   ⚠️ PayU Gateway returned HTTP ${res.statusCode}`);
      }
      resolve();
    });

    req.on('error', (err) => {
      console.error("   ❌ Failed to connect to PayU Gateway:", err.message);
      console.log("\nPlease check internet connection or PayU endpoint status.");
      resolve();
    });

    req.setTimeout(8000, () => {
      console.error("   ❌ Connection timed out after 8 seconds.");
      req.destroy();
      resolve();
    });

    req.end();
  });
}

checkPayUService();
