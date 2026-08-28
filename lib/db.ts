import fs from "fs";
import path from "path";
import {
  getAppwriteDatabases,
  ensureAppwriteSchema,
  APPWRITE_DATABASE_ID,
  APPWRITE_COLLECTION_ID,
  APPWRITE_API_KEY,
  ID,
  Query,
} from "./appwrite";
import type { Models } from "node-appwrite";

export interface RTIReport {
  id: string;
  title: string;
  image: string;
  status: "completed" | "pending";
  date: string;
  refNumber: string;
  department: string;
  description?: string;
  applicant?: string;
  email?: string;
  phone?: string;
  address?: string;
  state?: string;
  pincode?: string;
  isBPL?: boolean;
  bplNumber?: string;
  createdAt: number;
  response?: string[] | string;
}

export type CreateRTIInput = Omit<RTIReport, "createdAt"> & {
  createdAt?: number;
};

// In-memory runtime cache for recently created RTIs
const runtimeCache: RTIReport[] = [];

function mapDocumentToRti(doc: Models.Document | Record<string, unknown>): RTIReport {
  const data = doc as Record<string, unknown>;
  let parsedResponse: string[] | string | undefined = undefined;

  if (data.response) {
    if (Array.isArray(data.response)) {
      parsedResponse = data.response as string[];
    } else if (typeof data.response === "string") {
      try {
        parsedResponse = JSON.parse(data.response);
      } catch {
        parsedResponse = data.response;
      }
    }
  }

  const createdAtValue =
    typeof data.createdAt === "number"
      ? data.createdAt
      : typeof data.$createdAt === "string"
      ? new Date(data.$createdAt).getTime()
      : Date.now();

  return {
    id: (data.id as string) || (data.$id as string) || Date.now().toString(),
    title: (data.title as string) || "Untitled RTI Application",
    image: (data.image as string) || "",
    status: (data.status as "completed" | "pending") || "completed",
    date: (data.date as string) || "",
    refNumber: (data.refNumber as string) || "",
    department: (data.department as string) || "",
    description: (data.description as string) || undefined,
    applicant: (data.applicant as string) || undefined,
    email: (data.email as string) || undefined,
    phone: (data.phone as string) || undefined,
    address: (data.address as string) || undefined,
    state: (data.state as string) || undefined,
    pincode: (data.pincode as string) || undefined,
    isBPL: Boolean(data.isBPL),
    bplNumber: (data.bplNumber as string) || undefined,
    createdAt: createdAtValue,
    response: parsedResponse,
  };
}

function preparePayload(input: CreateRTIInput | Partial<RTIReport>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (input.title !== undefined) payload.title = input.title;
  if (input.image !== undefined) payload.image = input.image;
  if (input.status !== undefined) payload.status = input.status;
  if (input.date !== undefined) payload.date = input.date;
  if (input.refNumber !== undefined) payload.refNumber = input.refNumber;
  if (input.department !== undefined) payload.department = input.department;
  if (input.description !== undefined) payload.description = input.description;
  if (input.applicant !== undefined) payload.applicant = input.applicant;
  if (input.email !== undefined) payload.email = input.email;
  if (input.phone !== undefined) payload.phone = input.phone;
  if (input.address !== undefined) payload.address = input.address;
  if (input.state !== undefined) payload.state = input.state;
  if (input.pincode !== undefined) payload.pincode = input.pincode;
  if (input.isBPL !== undefined) payload.isBPL = Boolean(input.isBPL);
  if (input.bplNumber !== undefined) payload.bplNumber = input.bplNumber;
  if (input.createdAt !== undefined) payload.createdAt = Number(input.createdAt);

  if (input.response !== undefined) {
    payload.response = Array.isArray(input.response)
      ? JSON.stringify(input.response)
      : typeof input.response === "string"
      ? input.response
      : "";
  }

  return payload;
}

function getLocalFallbackRtis(): RTIReport[] {
  try {
    const jsonDbPath = path.join(process.cwd(), "data", "db.json");
    if (fs.existsSync(jsonDbPath)) {
      const raw = fs.readFileSync(jsonDbPath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const fileRtis = parsed.map((item) => mapDocumentToRti(item));
        // Merge runtime cache to include newly filed requests
        const combined = [...runtimeCache, ...fileRtis];
        const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
        return unique.sort((a, b) => b.createdAt - a.createdAt);
      }
    }
  } catch (e) {
    console.error("Fallback to local db.json failed:", e);
  }
  return runtimeCache;
}

export async function getAllRtis(): Promise<RTIReport[]> {
  try {
    const databases = getAppwriteDatabases();
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      [Query.orderDesc("createdAt"), Query.limit(100)]
    );

    const appwriteRtis = response.documents.map((doc) => mapDocumentToRti(doc));
    // Merge runtime cache items that might be in-flight
    const combined = [...runtimeCache, ...appwriteRtis];
    const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
    return unique.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error: unknown) {
    const err = error as { code?: number; type?: string; message?: string };
    if (APPWRITE_API_KEY && (err?.code === 404 || err?.type?.includes("not_found"))) {
      const ensured = await ensureAppwriteSchema();
      if (ensured) {
        try {
          const databases = getAppwriteDatabases();
          const response = await databases.listDocuments(
            APPWRITE_DATABASE_ID,
            APPWRITE_COLLECTION_ID,
            [Query.orderDesc("createdAt"), Query.limit(100)]
          );
          return response.documents.map((doc) => mapDocumentToRti(doc));
        } catch {}
      }
    }

    console.warn(
      `[Appwrite Notice] Could not read from database '${APPWRITE_DATABASE_ID}' / collection '${APPWRITE_COLLECTION_ID}': ${err?.message || "Not found"}. Using local cache.`
    );
    return getLocalFallbackRtis();
  }
}

export async function getRtiById(id: string): Promise<RTIReport | null> {
  try {
    const databases = getAppwriteDatabases();
    const doc = await databases.getDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      id
    );

    return mapDocumentToRti(doc);
  } catch {
    const all = getLocalFallbackRtis();
    const found = all.find((item) => item.id === id);
    return found || null;
  }
}

export async function getRtiByRefNumber(refNumber: string): Promise<RTIReport | null> {
  try {
    const databases = getAppwriteDatabases();
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      [Query.equal("refNumber", refNumber), Query.limit(1)]
    );

    if (response.documents.length > 0) {
      return mapDocumentToRti(response.documents[0]);
    }
    return null;
  } catch {
    const all = getLocalFallbackRtis();
    const found = all.find((item) => item.refNumber === refNumber);
    return found || null;
  }
}

export async function createRti(input: CreateRTIInput): Promise<RTIReport> {
  const now = input.createdAt || Date.now();
  const docId = input.id ? input.id.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 36) : ID.unique();

  const newReport: RTIReport = {
    ...input,
    id: docId,
    createdAt: now,
    status: input.status || "completed",
    image: input.image || "",
    isBPL: Boolean(input.isBPL),
  };

  // Add to runtime cache immediately so view-history instantly has it
  runtimeCache.unshift(newReport);

  // Persist to local JSON as well so data is never lost if cloud Appwrite collection is not yet ready
  try {
    const jsonDbPath = path.join(process.cwd(), "data", "db.json");
    let currentData: RTIReport[] = [];
    if (fs.existsSync(jsonDbPath)) {
      currentData = JSON.parse(fs.readFileSync(jsonDbPath, "utf-8"));
    }
    const updated = [newReport, ...currentData.filter((r) => r.id !== newReport.id)];
    fs.writeFileSync(jsonDbPath, JSON.stringify(updated, null, 2), "utf-8");
  } catch (fsErr) {
    console.error("Local backup write error:", fsErr);
  }

  // Attempt to write to Appwrite
  try {
    const databases = getAppwriteDatabases();
    const payload = preparePayload({
      ...input,
      createdAt: now,
    });

    const doc = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      docId,
      payload
    );

    return mapDocumentToRti(doc);
  } catch (error: unknown) {
    const err = error as { code?: number; type?: string; message?: string };
    if (APPWRITE_API_KEY && (err?.code === 404 || err?.type?.includes("not_found"))) {
      const ensured = await ensureAppwriteSchema();
      if (ensured) {
        try {
          const databases = getAppwriteDatabases();
          const payload = preparePayload({ ...input, createdAt: now });
          const doc = await databases.createDocument(
            APPWRITE_DATABASE_ID,
            APPWRITE_COLLECTION_ID,
            docId,
            payload
          );
          return mapDocumentToRti(doc);
        } catch (retryErr) {
          console.error("[Appwrite] Retry create document failed:", retryErr);
        }
      }
    }

    console.error(
      `[Appwrite Warning] Could not save to Appwrite (${err?.message || "check DB/Collection/Permissions"}). Application saved locally in fallback database.`
    );
    return newReport;
  }
}

export async function updateRti(
  id: string,
  updates: Partial<RTIReport>
): Promise<RTIReport | null> {
  try {
    const databases = getAppwriteDatabases();
    const payload = preparePayload(updates);

    const doc = await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      id,
      payload
    );

    return mapDocumentToRti(doc);
  } catch (error) {
    console.error(`[Appwrite] Error updating RTI with id ${id}:`, error);
    return null;
  }
}

export async function deleteRti(id: string): Promise<boolean> {
  // Remove from runtime cache
  const idx = runtimeCache.findIndex((r) => r.id === id);
  if (idx !== -1) runtimeCache.splice(idx, 1);

  // Remove from local fallback
  try {
    const jsonDbPath = path.join(process.cwd(), "data", "db.json");
    if (fs.existsSync(jsonDbPath)) {
      const currentData: RTIReport[] = JSON.parse(fs.readFileSync(jsonDbPath, "utf-8"));
      const updated = currentData.filter((r) => r.id !== id);
      fs.writeFileSync(jsonDbPath, JSON.stringify(updated, null, 2), "utf-8");
    }
  } catch (e) {
    console.error("Failed to delete from local backup:", e);
  }

  try {
    const databases = getAppwriteDatabases();
    await databases.deleteDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      id
    );
    return true;
  } catch (error) {
    console.error(`[Appwrite] Error deleting RTI with id ${id}:`, error);
    return true; // Still return true if deleted from local backup
  }
}
