import { MongoClient, type Db, type MongoClientOptions } from "mongodb";

const dbName = process.env.MONGODB_DB_NAME || "artisan_haven";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  var _mongoResolvedUri: Promise<string> | undefined;
}

function getMongoUri(): string | undefined {
  return (
    process.env.MONGODB_URI_STANDARD ||
    process.env.MONGODB_URI ||
    process.env.MONGO_URI
  );
}

const clientOptions: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 1,
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
};

type SrvRecord = { name: string; port: number };

/** DNS-over-HTTPS avoids Windows querySrv ECONNREFUSED on mongodb+srv URIs. */
async function resolveSrvViaDoH(hostname: string): Promise<SrvRecord[]> {
  const srvName = `_mongodb._tcp.${hostname}`;
  const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(srvName)}&type=SRV`;

  const res = await fetch(url, {
    headers: { Accept: "application/dns-json" },
  });

  if (!res.ok) {
    throw new Error(`SRV lookup failed (${res.status}) for ${hostname}`);
  }

  const data = (await res.json()) as {
    Answer?: Array<{ type: number; data: string }>;
  };

  const records =
    data.Answer?.filter((a) => a.type === 33).map((a) => {
      const [, , port, target] = a.data.split(" ");
      return {
        name: target.replace(/\.$/, ""),
        port: Number(port),
      };
    }) ?? [];

  if (records.length === 0) {
    throw new Error(`No SRV records found for ${hostname}`);
  }

  return records;
}

async function resolveSrvRecords(hostname: string): Promise<SrvRecord[]> {
  try {
    const dns = await import("dns");
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
    const records = await dns.promises.resolveSrv(`_mongodb._tcp.${hostname}`);
    return records.map((r) => ({
      name: r.name.replace(/\.$/, ""),
      port: r.port,
    }));
  } catch {
    return resolveSrvViaDoH(hostname);
  }
}

async function srvToStandardUri(srvUri: string): Promise<string> {
  const withoutScheme = srvUri.slice("mongodb+srv://".length);
  const atIdx = withoutScheme.indexOf("@");
  if (atIdx === -1) throw new Error("Invalid mongodb+srv URI");

  const credentials = withoutScheme.slice(0, atIdx);
  const rest = withoutScheme.slice(atIdx + 1);

  const slashIdx = rest.indexOf("/");
  const hostname = (
    slashIdx === -1 ? rest.split("?")[0] : rest.slice(0, slashIdx)
  ).trim();

  const path =
    slashIdx === -1 ? "" : (rest.slice(slashIdx).split("?")[0] ?? "");
  const queryStart = rest.indexOf("?");
  const query = queryStart === -1 ? "" : rest.slice(queryStart + 1);

  const records = await resolveSrvRecords(hostname);
  const hosts = records.map((r) => `${r.name}:${r.port}`).join(",");

  const params = new URLSearchParams(query);
  if (!params.has("ssl") && !params.has("tls")) params.set("ssl", "true");
  if (!params.has("authSource")) params.set("authSource", "admin");

  const qs = params.toString();
  return `mongodb://${credentials}@${hosts}${path}${qs ? `?${qs}` : ""}`;
}

async function resolveMongoUri(uri: string): Promise<string> {
  if (process.env.MONGODB_URI_STANDARD) {
    return process.env.MONGODB_URI_STANDARD;
  }
  if (!uri.startsWith("mongodb+srv://")) {
    return uri;
  }
  return srvToStandardUri(uri);
}

async function getResolvedUri(): Promise<string> {
  if (!global._mongoResolvedUri) {
    const uri = getMongoUri();
    if (!uri) {
      throw new Error(
        "MONGODB_URI is not set. Add it to .env (copy from .env.example)"
      );
    }
    global._mongoResolvedUri = resolveMongoUri(uri);
  }
  return global._mongoResolvedUri;
}

function getClientPromise(): Promise<MongoClient> {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = (async () => {
      const uri = await getResolvedUri();
      const client = new MongoClient(uri, clientOptions);
      return client.connect();
    })();
  }
  return global._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(dbName);
}

export function isMongoConfigured(): boolean {
  return Boolean(getMongoUri());
}

export function resetMongoClient() {
  global._mongoClientPromise = undefined;
  global._mongoResolvedUri = undefined;
}
