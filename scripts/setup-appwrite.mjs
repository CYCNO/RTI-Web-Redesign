import { Client, Databases, Permission, Role, ID } from "node-appwrite";
import fs from "fs";
import path from "path";

function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const file of envFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      content.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const match = trimmed.match(/^([^=]+)=(.*)$/);
          if (match) {
            const key = match[1].trim();
            const val = match[2].trim().replace(/^["']|["']$/g, "").trim();
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      });
    }
  }
}

loadEnv();

const endpoint =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
  process.env.APPWRITE_ENDPOINT ||
  "https://fra.cloud.appwrite.io/v1";

const projectId =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ||
  process.env.APPWRITE_PROJECT_ID ||
  "6a9156ec003a9469b2b3";

const apiKey = process.env.APPWRITE_API_KEY || process.env.APPWRITE_KEY;
const databaseId =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ||
  process.env.APPWRITE_DATABASE_ID ||
  "rti_db";
const collectionId =
  process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID ||
  process.env.APPWRITE_COLLECTION_ID ||
  "rtis";

console.log("==========================================");
console.log("  Appwrite Database & Collection Setup   ");
console.log("==========================================");
console.log(`Endpoint:   ${endpoint}`);
console.log(`Project ID: ${projectId}`);
console.log(`Database:   ${databaseId}`);
console.log(`Collection: ${collectionId}`);
console.log(`API Key:    ${apiKey ? "Present (" + apiKey.slice(0, 12) + "...)" : "Missing"}`);
console.log("------------------------------------------");

if (!apiKey) {
  console.error("❌ APPWRITE_API_KEY is missing from .env.");
  process.exit(1);
}

const client = new Client();
client.setEndpoint(endpoint).setProject(projectId).setKey(apiKey);

const databases = new Databases(client);

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function setup() {
  // 1. Ensure Database exists
  try {
    await databases.get(databaseId);
    console.log(`✓ Database "${databaseId}" found.`);
  } catch (err) {
    console.log(`Creating Database "${databaseId}"...`);
    await databases.create(databaseId, "RTI Database");
    console.log(`✓ Database "${databaseId}" created successfully.`);
  }

  // 2. Ensure Collection exists
  try {
    await databases.getCollection(databaseId, collectionId);
    console.log(`✓ Collection "${collectionId}" found.`);
  } catch (err) {
    console.log(`Creating Collection "${collectionId}"...`);
    await databases.createCollection(
      databaseId,
      collectionId,
      "RTI Applications",
      [
        Permission.read(Role.any()),
        Permission.create(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any()),
      ]
    );
    console.log(`✓ Collection "${collectionId}" created with public permissions.`);
  }

  // 3. Create Attributes
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
        databaseId,
        collectionId,
        attr.key,
        attr.size,
        attr.required,
        attr.default
      );
      console.log(`  + String attribute created: ${attr.key}`);
    } catch (e) {
      // Attribute might already exist
    }
  }

  try {
    await databases.createBooleanAttribute(
      databaseId,
      collectionId,
      "isBPL",
      false,
      false
    );
    console.log("  + Boolean attribute created: isBPL");
  } catch (e) {}

  try {
    await databases.createIntegerAttribute(
      databaseId,
      collectionId,
      "createdAt",
      true
    );
    console.log("  + Integer attribute created: createdAt");
  } catch (e) {}

  console.log("Waiting 3 seconds for Appwrite attributes to become available in cloud...");
  await sleep(3000);

  // 4. Seed initial records from db.json if collection is empty
  try {
    const listRes = await databases.listDocuments(databaseId, collectionId);
    console.log(`Current documents in Appwrite: ${listRes.total}`);

    if (listRes.total === 0) {
      const jsonDbPath = path.join(process.cwd(), "data", "db.json");
      if (fs.existsSync(jsonDbPath)) {
        const seedData = JSON.parse(fs.readFileSync(jsonDbPath, "utf-8"));
        console.log(`Seeding ${seedData.length} records into Appwrite...`);

        for (const item of seedData) {
          const docId = item.id ? item.id.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 36) : ID.unique();
          const payload = {
            title: item.title || "Untitled RTI",
            image: item.image || "",
            status: item.status || "completed",
            date: item.date || "",
            refNumber: item.refNumber || "",
            department: item.department || "",
            description: item.description || "",
            applicant: item.applicant || "",
            email: item.email || "",
            phone: item.phone || "",
            isBPL: Boolean(item.isBPL),
            createdAt: Number(item.createdAt) || Date.now(),
            response: Array.isArray(item.response)
              ? JSON.stringify(item.response)
              : typeof item.response === "string"
              ? item.response
              : "",
          };

          try {
            await databases.createDocument(databaseId, collectionId, docId, payload);
            console.log(`  ✓ Seeded document: ${item.refNumber} (${item.title})`);
          } catch (seedErr) {
            console.error(`  ✕ Error seeding ${item.refNumber}:`, seedErr.message);
          }
        }
      }
    }
  } catch (seedCheckErr) {
    console.warn("Could not check/seed documents:", seedCheckErr.message);
  }

  console.log("\n✨ Appwrite Database is 100% configured and connected!");
}

setup().catch((err) => {
  console.error("❌ Setup failed:", err);
});
