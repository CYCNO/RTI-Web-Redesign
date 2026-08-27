import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { user, pass } = await req.json();
    const inputUser = (user || "").trim().toLowerCase();
    const inputPass = (pass || "").trim();

    // Check all possible environment variable names the user might have set
    const validUsers = [
      process.env.LOGIN_USERNAME,
      process.env.LOGIN_EMAIL,
      process.env.GMAIL,
      process.env.EMAIL,
      process.env.USER_EMAIL,
      process.env.USER,
      process.env.ADMIN_EMAIL,
      process.env.NEXT_PUBLIC_LOGIN_USERNAME,
      process.env.NEXT_PUBLIC_LOGIN_EMAIL,
      process.env.NEXT_PUBLIC_GMAIL,
      process.env.NEXT_PUBLIC_EMAIL,
    ].filter(Boolean) as string[];

    const validPasswords = [
      process.env.LOGIN_PASSWORD,
      process.env.PASSWORD,
      process.env.GMAIL_PASSWORD,
      process.env.USER_PASSWORD,
      process.env.ADMIN_PASSWORD,
      process.env.NEXT_PUBLIC_LOGIN_PASSWORD,
      process.env.NEXT_PUBLIC_PASSWORD,
    ].filter(Boolean) as string[];

    // If no credentials configured in env, deny with message
    if (validUsers.length === 0 || validPasswords.length === 0) {
      console.warn("No login credentials found in process.env (.env or .env.local)");
      return NextResponse.json(
        {
          success: false,
          error: "Login credentials not configured in .env (e.g. GMAIL/LOGIN_USERNAME and PASSWORD/LOGIN_PASSWORD)",
        },
        { status: 401 }
      );
    }

    const userMatches = validUsers.some((envUser) => {
      const u = envUser.trim().toLowerCase();
      const uWithoutDomain = u.replace(/@gmail\.com$/, "");
      const inputWithoutDomain = inputUser.replace(/@gmail\.com$/, "");
      return (
        inputUser === u ||
        inputUser === `${u}@gmail.com` ||
        inputWithoutDomain === uWithoutDomain
      );
    });

    const passMatches = validPasswords.some((envPass) => inputPass === envPass.trim());

    if (userMatches && passMatches) {
      return NextResponse.json({
        success: true,
        user: inputUser,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid username/email or password" },
      { status: 401 }
    );
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "Authentication request failed" },
      { status: 500 }
    );
  }
}
