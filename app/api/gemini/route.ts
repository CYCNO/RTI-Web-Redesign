import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function GET() {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "GROQ_API_KEY is not configured in .env.local",
        },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant for the official Right to Information (RTI) portal of India.",
        },
        {
          role: "user",
          content: "Generate an inspiring, concise 1-2 sentence welcome message for citizens visiting the portal.",
        },
      ],
    });

    const aiText = completion.choices[0]?.message?.content || "Welcome to the RTI Online Portal.";

    return NextResponse.json({
      success: true,
      text: aiText,
    });
  } catch (error: any) {
    console.error("Groq API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate AI response",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "GROQ_API_KEY is not configured in .env.local",
        },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "user",
          content: prompt || "Hello!",
        },
      ],
    });

    const aiText = completion.choices[0]?.message?.content || "";

    return NextResponse.json({
      success: true,
      text: aiText,
    });
  } catch (error: any) {
    console.error("Groq API POST Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate AI response",
      },
      { status: 500 }
    );
  }
}
