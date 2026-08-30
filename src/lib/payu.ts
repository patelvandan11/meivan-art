import crypto from "crypto";
import { getAppUrl } from "@/lib/env";

export interface PayUConfig {
  merchantKey: string;
  merchantSalt: string;
  mode: "test" | "live";
  paymentUrl: string;
}

export function getPayUConfig(): PayUConfig {
  const merchantKey = process.env.PAYU_MERCHANT_KEY || "gtKFFx"; // Default PayU test key
  const merchantSalt = process.env.PAYU_MERCHANT_SALT || "eCwWELxi"; // Default PayU test salt
  const mode = (process.env.PAYU_MODE === "live" ? "live" : "test") as "test" | "live";
  
  const paymentUrl =
    mode === "live"
      ? "https://secure.payu.in/_payment"
      : "https://test.payu.in/_payment";

  return {
    merchantKey,
    merchantSalt,
    mode,
    paymentUrl,
  };
}

export interface PayUPaymentParams {
  txnid: string;
  amount: number;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl?: string;
  furl?: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}

/**
 * Generate PayU Request Hash
 * Formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt)
 */
export function generatePayUHash(params: PayUPaymentParams): {
  hash: string;
  payuData: Record<string, string>;
  paymentUrl: string;
} {
  const config = getPayUConfig();
  const appUrl = getAppUrl();

  const formattedAmount = Number(params.amount).toFixed(2);
  const surl = params.surl || `${appUrl}/api/payment/payu/response`;
  const furl = params.furl || `${appUrl}/api/payment/payu/response`;
  const udf1 = params.udf1 || "";
  const udf2 = params.udf2 || "";
  const udf3 = params.udf3 || "";
  const udf4 = params.udf4 || "";
  const udf5 = params.udf5 || "";

  const hashSequence = `${config.merchantKey}|${params.txnid}|${formattedAmount}|${params.productinfo}|${params.firstname}|${params.email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${config.merchantSalt}`;

  const hash = crypto.createHash("sha512").update(hashSequence).digest("hex");

  const payuData: Record<string, string> = {
    key: config.merchantKey,
    txnid: params.txnid,
    amount: formattedAmount,
    productinfo: params.productinfo,
    firstname: params.firstname,
    email: params.email,
    phone: params.phone,
    surl,
    furl,
    hash,
    udf1,
    udf2,
    udf3,
    udf4,
    udf5,
    service_provider: "payu_paisa",
  };

  return {
    hash,
    payuData,
    paymentUrl: config.paymentUrl,
  };
}

export interface PayUCallbackBody {
  mihpayid?: string;
  mode?: string;
  status?: string;
  unmappedstatus?: string;
  key?: string;
  txnid?: string;
  amount?: string;
  cardCategory?: string;
  discount?: string;
  net_amount_debit?: string;
  addedon?: string;
  productinfo?: string;
  firstname?: string;
  lastname?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  email?: string;
  phone?: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  hash?: string;
  field1?: string;
  field2?: string;
  field3?: string;
  field4?: string;
  field5?: string;
  field6?: string;
  field7?: string;
  field8?: string;
  field9?: string;
  payment_source?: string;
  PG_TYPE?: string;
  bank_ref_num?: string;
  bankcode?: string;
  error?: string;
  error_Message?: string;
  additionalCharges?: string;
}

/**
 * Verify PayU Response Hash
 * Formula:
 * If additionalCharges: sha512(additionalCharges|salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 * Else: sha512(salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 */
export function verifyPayUResponseHash(body: PayUCallbackBody): boolean {
  const config = getPayUConfig();
  const receivedHash = body.hash;
  if (!receivedHash) return false;

  const status = body.status || "";
  const udf1 = body.udf1 || "";
  const udf2 = body.udf2 || "";
  const udf3 = body.udf3 || "";
  const udf4 = body.udf4 || "";
  const udf5 = body.udf5 || "";
  const email = body.email || "";
  const firstname = body.firstname || "";
  const productinfo = body.productinfo || "";
  const amount = body.amount || "";
  const txnid = body.txnid || "";
  const key = body.key || config.merchantKey;

  let hashSequence = "";
  if (body.additionalCharges) {
    hashSequence = `${body.additionalCharges}|${config.merchantSalt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  } else {
    hashSequence = `${config.merchantSalt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  }

  const calculatedHash = crypto.createHash("sha512").update(hashSequence).digest("hex");
  return calculatedHash.toLowerCase() === receivedHash.toLowerCase();
}
