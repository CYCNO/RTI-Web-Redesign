import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getDepartmentImageUrl } from "@/lib/departmentImages";
import { cleanPdfText } from "@/lib/generateRtiPdf";
import Groq from "groq-sdk";

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

async function generateAiRtiPoints(
  ministry: string,
  subject: string,
  description: string,
  applicant: string,
  refNumber: string
): Promise<string[]> {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    const groq = new Groq({ apiKey });
    const prompt = `You are the Central Public Information Officer (CPIO) under the Right to Information Act, 2005 for the ${ministry}, Government of India.
Citizen ${applicant || "Citizen"} has filed the following RTI request:
- Subject: ${subject || "Public Information Request"}
- Query Details: ${description || "Requesting official disclosure, financial outlays, audit inspections, and administrative records."}

Generate exactly 3 to 5 realistic, professional, and detailed RTI response points providing clear official disclosures, allocation figures, audit verification, and statutory findings.

Format each point strictly as:
[NUMBER]. [TOPIC IN UPPERCASE]: [Detailed administrative disclosure and factual response text]

Example format:
1. BUDGETARY ALLOCATION & DISBURSEMENT: A total sum of INR ...
2. AUDIT & QUALITY COMPLIANCE: The inspection records indicate ...
3. STATUTORY RECORD DISCLOSURE: Certified copies of ...

Do not output any introductory or conversational text. Only output the 3 to 5 numbered points.`;

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
    });

    const rawText = completion.choices[0]?.message?.content || "";
    const points = rawText
      .split(/\n+/)
      .map((line) => cleanPdfText(line.trim()))
      .filter((line) => /^[0-9]+\./.test(line));

    if (points.length >= 3) {
      return points.slice(0, 5);
    }
  } catch (error) {
    console.error("Failed to generate AI RTI points with Groq:", error);
  }

  // High quality fallback points if API encounters issues
  return [
    `1. APPLICATION PROCESSING & AUDIT: (Our internal ai api failed for some reason, so here is a dummy answer) Your application bearing registration ${refNumber} has been verified and registered by the nodal desk of ${ministry}.`,
    `2. FINANCIAL DISBURSEMENT & RECORDS: Relevant administrative divisions have retrieved the necessary operational files and budget allocation data.`,
    `3. STATUTORY COMPLIANCE: Inspection records and quality assurance logs confirm adherence to mandated guidelines.`,
    `4. RECORD INSPECTION: Certified copies and corresponding official logs remain available for inspection under Section 4(1)(b) of the Act.`
  ];
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

    // Generate 3-5 points using Groq AI
    const aiPoints = await generateAiRtiPoints(
      ministryName,
      body.subject || "RTI Inquiry",
      body.description || "",
      body.fullName || "Applicant",
      randomRef
    );

    const fullResponseArray = [
      `With reference to your online RTI application regarding "${body.subject || "the submitted query"}", the status and information from ${ministryName} is furnished below:`,
      ...aiPoints,
      `Any person aggrieved by this response may file an appeal under Section 19(1) of the RTI Act within thirty (30) days from receipt of this communication before the designated First Appellate Authority.`
    ];

    const newReport = {
      id: Date.now().toString(),
      title: body.subject || "Untitled RTI Application",
      image: imageUrl,
      status: "completed",
      date: formattedDate,
      refNumber: randomRef,
      department: ministryName,
      description: body.description || "",
      applicant: body.fullName || "Applicant",
      email: body.email || "",
      phone: body.phone || "",
      isBPL: body.isBPL || false,
      createdAt: Date.now(),
      response: fullResponseArray,
    };

    // Prepend new RTI so it appears at the top
    const updatedReports = [newReport, ...reports];
    await writeDatabase(updatedReports);

    return NextResponse.json({ success: true, data: newReport }, { status: 201 });
  } catch (error) {
    console.error("Error submitting RTI request:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit RTI request" },
      { status: 500 }
    );
  }
}
