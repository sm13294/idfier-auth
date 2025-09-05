export interface IdfierConfig {
  clientId: string;
  clientSecret: string;
  baseUrl: string;
}

export interface CreateLoginRequestParams {
  webHookUrl: string;
  webSecret: string[];
}

export interface LoginRequestResult {
  referenceId: string;
  deepLink: string;
  universalLink: string;
}

export interface UserData {
  id: string;
  personalNo: string;
  fullname: string;
  handle: string;
  authMethodId: string;
  dateOfBirth: string;
  country: string;
}

export interface SessionData {
  referenceId: string;
  status: "pending" | "scanned" | "approved" | "expired" | "failed";
  expiresAt: string;
  createdAt: string;
}

export interface AuthResult {
  user?: UserData;
  session: SessionData;
}

export class IdfierService {
  private config: IdfierConfig;

  constructor(config: IdfierConfig) {
    this.config = config;
  }

  async createLoginRequest(
    params: CreateLoginRequestParams
  ): Promise<LoginRequestResult> {
    if (
      !this.config.baseUrl ||
      !this.config.clientSecret ||
      !this.config.clientId
    ) {
      throw new Error(
        "Idfier configuration is incomplete. Please check environment variables."
      );
    }

    const requestUrl = `${this.config.baseUrl}/business/auth/request`;

    const formData = new URLSearchParams();
    formData.append("webHookUrl", params.webHookUrl);
    formData.append("webSecret", params.webSecret.join(","));

    const response = await fetch(requestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
      body: formData,
    });

    if (!response.ok) {
      // Try to get error details from response
      let errorDetails = "";
      try {
        const errorResponse = await response.text();
        errorDetails = errorResponse;
      } catch (e) {
        errorDetails = "Could not read error response";
      }

      throw new Error(
        `Failed to create login request: ${response.status} ${response.statusText}. Details: ${errorDetails}`
      );
    }

    const data = await response.json();

    if (data.status !== 100) {
      throw new Error("Failed to create login request");
    }

    return data.data;
  }

  async getResult(referenceId: string): Promise<AuthResult | null> {
    // Validate config
    if (
      !this.config.baseUrl ||
      !this.config.clientSecret ||
      !this.config.clientId
    ) {
      throw new Error(
        "Idfier configuration is incomplete. Please check environment variables."
      );
    }

    const formData = new URLSearchParams();
    formData.append("referenceId", referenceId);

    const response = await fetch(
      `${this.config.baseUrl}/business/auth/result`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.status !== 100) {
      return null;
    }

    // Return the full result with session and user data
    return {
      user: data.data?.user || null,
      session: {
        referenceId: referenceId,
        status: data.data?.session?.status || "pending",
        expiresAt: data.data?.session?.expiresAt || new Date().toISOString(),
        createdAt: data.data?.session?.createdAt || new Date().toISOString(),
      },
    };
  }
}
