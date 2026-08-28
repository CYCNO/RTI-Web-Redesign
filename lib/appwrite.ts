import { Client, Databases, ID, Query, Permission, Role } from "node-appwrite";

function cleanEnv(val?: string): string {
  if (!val) return "";
  return val.trim().replace(/^["']|["']$/g, "").trim();
}

export const APPWRITE_ENDPOINT =
  cleanEnv(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) ||
  cleanEnv(process.env.APPWRITE_ENDPOINT) ||
  "https://fra.cloud.appwrite.io/v1";

export const APPWRITE_PROJECT_ID =
  cleanEnv(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) ||
  cleanEnv(process.env.APPWRITE_PROJECT_ID) ||
  "6a9156ec003a9469b2b3";

export const APPWRITE_PROJECT_NAME =
  cleanEnv(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_NAME) ||
  cleanEnv(process.env.APPWRITE_PROJECT_NAME) ||
  "hackathon(rti)";

export const APPWRITE_DATABASE_ID =
  cleanEnv(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID) ||
  cleanEnv(process.env.APPWRITE_DATABASE_ID) ||
  "rti_db";

export const APPWRITE_COLLECTION_ID =
  cleanEnv(process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID) ||
  cleanEnv(process.env.APPWRITE_COLLECTION_ID) ||
  "rtis";

export const APPWRITE_API_KEY =
  cleanEnv(process.env.APPWRITE_API_KEY) ||
  cleanEnv(process.env.APPWRITE_KEY) ||
  "";

export function getAppwriteClient(): Client {
  const client = new Client();
  client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);

  if (APPWRITE_API_KEY) {
    client.setKey(APPWRITE_API_KEY);
  }

  return client;
}

export function getAppwriteDatabases(): Databases {
  const client = getAppwriteClient();
  return new Databases(client);
}

let schemaEnsured = false;

export async function ensureAppwriteSchema(): Promise<boolean> {
  if (schemaEnsured) return true;
  if (!APPWRITE_API_KEY) return false;

  const databases = getAppwriteDatabases();

  try {
    try {
      await databases.get(APPWRITE_DATABASE_ID);
    } catch (err: unknown) {
      const errorObj = err as { code?: number; type?: string };
      if (errorObj?.code === 404 || errorObj?.type === "database_not_found") {
        console.log(`[Appwrite] Auto-creating Database "${APPWRITE_DATABASE_ID}"...`);
        await databases.create(APPWRITE_DATABASE_ID, "RTI Database");
      } else {
        throw err;
      }
    }

    try {
      await databases.getCollection(APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID);
    } catch (err: unknown) {
      const errorObj = err as { code?: number; type?: string };
      if (errorObj?.code === 404 || errorObj?.type === "collection_not_found") {
        console.log(`[Appwrite] Auto-creating Collection "${APPWRITE_COLLECTION_ID}"...`);
        await databases.createCollection(
          APPWRITE_DATABASE_ID,
          APPWRITE_COLLECTION_ID,
          "RTI Applications",
          [
            Permission.read(Role.any()),
            Permission.create(Role.any()),
            Permission.update(Role.any()),
            Permission.delete(Role.any()),
          ]
        );

        const stringAttributes = [
          { key: "title", size: 255, required: true },
          { key: "image", size: 1000, required: false },
          { key: "status", size: 50, required: false, default: "completed" },
          { key: "date", size: 50, required: true },
          { key: "refNumber", size: 100, required: true },
          { key: "department", size: 255, required: true },
          { key: "description", size: 5000, required: false },
          { key: "applicant", size: 255, required: false },
          { key: "email", size: 255, required: false },
          { key: "phone", size: 50, required: false },
          { key: "address", size: 1000, required: false },
          { key: "state", size: 100, required: false },
          { key: "pincode", size: 20, required: false },
          { key: "bplNumber", size: 100, required: false },
          { key: "response", size: 10000, required: false },
        ];

        for (const attr of stringAttributes) {
          try {
            await databases.createStringAttribute(
              APPWRITE_DATABASE_ID,
              APPWRITE_COLLECTION_ID,
              attr.key,
              attr.size,
              attr.required,
              attr.default
            );
          } catch {}
        }

        try {
          await databases.createBooleanAttribute(
            APPWRITE_DATABASE_ID,
            APPWRITE_COLLECTION_ID,
            "isBPL",
            false,
            false
          );
        } catch {}

        try {
          await databases.createIntegerAttribute(
            APPWRITE_DATABASE_ID,
            APPWRITE_COLLECTION_ID,
            "createdAt",
            true
          );
        } catch {}
      } else {
        throw err;
      }
    }

    schemaEnsured = true;
    return true;
  } catch (schemaErr) {
    console.error("[Appwrite] Failed to auto-provision schema:", schemaErr);
    return false;
  }
}

export { ID, Query, Permission, Role };
