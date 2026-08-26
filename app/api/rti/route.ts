import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getDepartmentImageUrl } from "@/lib/departmentImages";

const dbPath = path.join(process.cwd(), "data", "db.json");

async function readDatabase() {
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeDatabase(data: any) {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  try {
    const reports = await readDatabase();
    return NextResponse.json({ success: true, data: reports });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to read database" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const reports = await readDatabase();

    const formattedDate = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const randomRef = `RTI/${new Date().getFullYear()}/${Math.floor(
      100 + Math.random() * 900
    )}`;

    const ministryName = body.ministry || "Ministry / Department";
    const imageUrl = getDepartmentImageUrl(ministryName);

    const newReport = {
      id: Date.now().toString(),
      title: body.subject || "Untitled RTI Application",
      image: imageUrl,
      status: "pending",
      date: formattedDate,
      refNumber: randomRef,
      department: ministryName,
      description: body.description || "",
      applicant: body.fullName || "Applicant",
      email: body.email || "",
      phone: body.phone || "",
      isBPL: body.isBPL || false,
      response: [
        `With reference to your online RTI application regarding "${body.subject || "the submitted query"}", the status and information from ${ministryName} is furnished below:`,
        `1. APPLICATION PROCESSING: Your application bearing registration ${randomRef} has been recorded and registered.`,
        `2. AUDIT & RECORDS EXAMINED: Relevant administrative divisions have retrieved the necessary operational files and expenditure allocations.`,
        `3. APPEAL PROVISIONS: Any person aggrieved by this response may file an appeal under Section 19(1) of the RTI Act within thirty (30) days from receipt of this communication before the designated First Appellate Authority.`
      ],
    };

    // Prepend new RTI so it appears at the top
    const updatedReports = [newReport, ...reports];
    await writeDatabase(updatedReports);

    return NextResponse.json({ success: true, data: newReport }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to submit RTI request" },
      { status: 500 }
    );
  }
}
