import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

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

interface DBRow {
  id: string;
  title: string;
  image: string | null;
  status: string;
  date: string;
  refNumber: string;
  department: string;
  description: string | null;
  applicant: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  state: string | null;
  pincode: string | null;
  isBPL: number;
  bplNumber: string | null;
  createdAt: number;
  response: string | null;
}

declare global {
  var __sqliteDbInstance: Database.Database | undefined;
}

function getDatabase(): Database.Database {
  if (global.__sqliteDbInstance) {
    return global.__sqliteDbInstance;
  }

  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbFilePath = path.join(dataDir, "rti.db");
  const db = new Database(dbFilePath);

  // Enable WAL mode for high performance concurrency
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  // Create RTI applications table
  db.exec(`
    CREATE TABLE IF NOT EXISTS rtis (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      image TEXT,
      status TEXT NOT NULL DEFAULT 'completed',
      date TEXT NOT NULL,
      refNumber TEXT NOT NULL,
      department TEXT NOT NULL,
      description TEXT,
      applicant TEXT,
      email TEXT,
      phone TEXT,
      address TEXT,
      state TEXT,
      pincode TEXT,
      isBPL INTEGER NOT NULL DEFAULT 0,
      bplNumber TEXT,
      createdAt INTEGER NOT NULL,
      response TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_rtis_created_at ON rtis (createdAt DESC);
    CREATE INDEX IF NOT EXISTS idx_rtis_ref_number ON rtis (refNumber);
    CREATE INDEX IF NOT EXISTS idx_rtis_department ON rtis (department);
  `);

  // Migrate existing data from db.json if the database table is empty
  try {
    const countResult = db.prepare("SELECT COUNT(*) as count FROM rtis").get() as { count: number };
    if (countResult && countResult.count === 0) {
      const jsonDbPath = path.join(dataDir, "db.json");
      if (fs.existsSync(jsonDbPath)) {
        const raw = fs.readFileSync(jsonDbPath, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const insertStmt = db.prepare(`
            INSERT INTO rtis (
              id, title, image, status, date, refNumber, department,
              description, applicant, email, phone, address, state,
              pincode, isBPL, bplNumber, createdAt, response
            ) VALUES (
              @id, @title, @image, @status, @date, @refNumber, @department,
              @description, @applicant, @email, @phone, @address, @state,
              @pincode, @isBPL, @bplNumber, @createdAt, @response
            )
          `);

          const insertMany = db.transaction((records: RTIReport[]) => {
            for (const item of records) {
              insertStmt.run({
                id: item.id || Date.now().toString(),
                title: item.title || "Untitled RTI Application",
                image: item.image || "",
                status: item.status || "completed",
                date: item.date || "",
                refNumber: item.refNumber || "",
                department: item.department || "",
                description: item.description || null,
                applicant: item.applicant || null,
                email: item.email || null,
                phone: item.phone || null,
                address: item.address || null,
                state: item.state || null,
                pincode: item.pincode || null,
                isBPL: item.isBPL ? 1 : 0,
                bplNumber: item.bplNumber || null,
                createdAt: Number(item.createdAt) || Date.now(),
                response: Array.isArray(item.response)
                  ? JSON.stringify(item.response)
                  : typeof item.response === "string"
                  ? item.response
                  : null,
              });
            }
          });

          insertMany(parsed);
          console.log(`[SQLite] Successfully migrated ${parsed.length} RTI records from db.json into rti.db`);
        }
      }
    }
  } catch (migErr) {
    console.error("[SQLite] Error migrating db.json to SQLite:", migErr);
  }

  global.__sqliteDbInstance = db;
  return db;
}

function mapRowToRTI(row: DBRow): RTIReport {
  let parsedResponse: string[] | string | undefined = undefined;
  if (row.response) {
    try {
      parsedResponse = JSON.parse(row.response);
    } catch {
      parsedResponse = row.response;
    }
  }

  return {
    id: row.id,
    title: row.title,
    image: row.image || "",
    status: row.status as "completed" | "pending",
    date: row.date,
    refNumber: row.refNumber,
    department: row.department,
    description: row.description || undefined,
    applicant: row.applicant || undefined,
    email: row.email || undefined,
    phone: row.phone || undefined,
    address: row.address || undefined,
    state: row.state || undefined,
    pincode: row.pincode || undefined,
    isBPL: Boolean(row.isBPL),
    bplNumber: row.bplNumber || undefined,
    createdAt: row.createdAt,
    response: parsedResponse,
  };
}

export function getAllRtis(): RTIReport[] {
  const db = getDatabase();
  const rows = db
    .prepare("SELECT * FROM rtis ORDER BY createdAt DESC")
    .all() as DBRow[];
  return rows.map(mapRowToRTI);
}

export function getRtiById(id: string): RTIReport | null {
  const db = getDatabase();
  const row = db.prepare("SELECT * FROM rtis WHERE id = ?").get(id) as DBRow | undefined;
  return row ? mapRowToRTI(row) : null;
}

export function getRtiByRefNumber(refNumber: string): RTIReport | null {
  const db = getDatabase();
  const row = db.prepare("SELECT * FROM rtis WHERE refNumber = ?").get(refNumber) as DBRow | undefined;
  return row ? mapRowToRTI(row) : null;
}

export function createRti(input: CreateRTIInput): RTIReport {
  const db = getDatabase();
  const now = input.createdAt || Date.now();
  const id = input.id || now.toString();

  const serializedResponse = Array.isArray(input.response)
    ? JSON.stringify(input.response)
    : typeof input.response === "string"
    ? input.response
    : null;

  const stmt = db.prepare(`
    INSERT INTO rtis (
      id, title, image, status, date, refNumber, department,
      description, applicant, email, phone, address, state,
      pincode, isBPL, bplNumber, createdAt, response
    ) VALUES (
      @id, @title, @image, @status, @date, @refNumber, @department,
      @description, @applicant, @email, @phone, @address, @state,
      @pincode, @isBPL, @bplNumber, @createdAt, @response
    )
  `);

  stmt.run({
    id,
    title: input.title,
    image: input.image || "",
    status: input.status || "completed",
    date: input.date,
    refNumber: input.refNumber,
    department: input.department,
    description: input.description || null,
    applicant: input.applicant || null,
    email: input.email || null,
    phone: input.phone || null,
    address: input.address || null,
    state: input.state || null,
    pincode: input.pincode || null,
    isBPL: input.isBPL ? 1 : 0,
    bplNumber: input.bplNumber || null,
    createdAt: now,
    response: serializedResponse,
  });

  return {
    ...input,
    id,
    createdAt: now,
    status: input.status || "completed",
    image: input.image || "",
    isBPL: Boolean(input.isBPL),
  };
}

export function updateRti(id: string, updates: Partial<RTIReport>): RTIReport | null {
  const existing = getRtiById(id);
  if (!existing) return null;

  const db = getDatabase();
  const merged: RTIReport = { ...existing, ...updates };

  const serializedResponse = Array.isArray(merged.response)
    ? JSON.stringify(merged.response)
    : typeof merged.response === "string"
    ? merged.response
    : null;

  const stmt = db.prepare(`
    UPDATE rtis SET
      title = @title,
      image = @image,
      status = @status,
      date = @date,
      refNumber = @refNumber,
      department = @department,
      description = @description,
      applicant = @applicant,
      email = @email,
      phone = @phone,
      address = @address,
      state = @state,
      pincode = @pincode,
      isBPL = @isBPL,
      bplNumber = @bplNumber,
      response = @response
    WHERE id = @id
  `);

  stmt.run({
    id,
    title: merged.title,
    image: merged.image || "",
    status: merged.status,
    date: merged.date,
    refNumber: merged.refNumber,
    department: merged.department,
    description: merged.description || null,
    applicant: merged.applicant || null,
    email: merged.email || null,
    phone: merged.phone || null,
    address: merged.address || null,
    state: merged.state || null,
    pincode: merged.pincode || null,
    isBPL: merged.isBPL ? 1 : 0,
    bplNumber: merged.bplNumber || null,
    response: serializedResponse,
  });

  return merged;
}

export function deleteRti(id: string): boolean {
  const db = getDatabase();
  const stmt = db.prepare("DELETE FROM rtis WHERE id = ?");
  const result = stmt.run(id);
  return result.changes > 0;
}
