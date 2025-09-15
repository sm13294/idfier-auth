import { NextRequest, NextResponse } from "next/server";
import { IdfierService } from "@/lib/services/idfier";

// Validate environment variables
const requiredEnvVars = {
  IDFIER_CLIENT_ID: process.env.IDFIER_CLIENT_ID,
  IDFIER_CLIENT_SECRET: process.env.IDFIER_CLIENT_SECRET,
  IDFIER_API_BASE_URL: process.env.IDFIER_API_BASE_URL,
};

const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([value]) => !value)
  .map(([key]) => key);

if (missingEnvVars.length > 0) {
  console.error("Missing required environment variables:", missingEnvVars);
}

const idfierService = new IdfierService({
  clientId: requiredEnvVars.IDFIER_CLIENT_ID!,
  clientSecret: requiredEnvVars.IDFIER_CLIENT_SECRET!,
  baseUrl: requiredEnvVars.IDFIER_API_BASE_URL!,
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

    const { referenceId } = await request.json();

    if (!referenceId) {
      return NextResponse.json(
        { error: "Missing referenceId" },
        { status: 400 }
      );
    }

    const result = await idfierService.getResult(referenceId);

    if (!result) {
      return NextResponse.json({
        status: "SUCCESS",
        data: {
          user: null,
          session: {
            referenceId: referenceId,
            status: "pending",
            expiresAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          },
        },
      });
    }
    return NextResponse.json({
      status: "SUCCESS",
      data: result,
    });
  } catch (error) {
    console.error("Idfier result check error:", error);

    let errorMessage = "Failed to check result";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
