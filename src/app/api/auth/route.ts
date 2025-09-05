import { NextRequest, NextResponse } from "next/server";
import { IdfierService } from "@/lib/services/idfier";

// Validate environment variables
const requiredEnvVars = {
  IDFIER_CLIENT_ID: process.env.IDFIER_CLIENT_ID,
  IDFIER_CLIENT_SECRET: process.env.IDFIER_CLIENT_SECRET,
  IDFIER_BASE_URL: process.env.IDFIER_BASE_URL,
};

const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingEnvVars.length > 0) {
  console.error("Missing required environment variables:", missingEnvVars);
}

const idfierService = new IdfierService({
  clientId: requiredEnvVars.IDFIER_CLIENT_ID!,
  clientSecret: requiredEnvVars.IDFIER_CLIENT_SECRET!,
  baseUrl: requiredEnvVars.IDFIER_BASE_URL!,
});

export async function POST(request: NextRequest) {
  try {
    if (missingEnvVars.length > 0) {
      return NextResponse.json(
        {
          error: "Server configuration error",
          details: `Missing environment variables: ${missingEnvVars.join(
            ", "
          )}`,
        },
        { status: 500 }
      );
    }

    // Përdorim konfigurimin e serverit në vend të input-it të përdoruesit
    const webHookUrl = `${
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    }/api/auth/callback`;
    const webSecret = process.env.IDFIER_WEB_SECRET || "default-web-secret";

    const result = await idfierService.createLoginRequest({
      webHookUrl,
      webSecret: [webSecret],
    });

    return NextResponse.json({
      status: "SUCCESS",
      data: result,
    });
  } catch (error) {
    console.error("Idfier login request error:", error);

    // Provide more specific error messages
    let errorMessage = "Failed to create login request";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
