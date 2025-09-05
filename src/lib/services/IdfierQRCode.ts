import QRCode from "qrcode";

export class IdfierQRCode {
  private interval: NodeJS.Timeout | null = null;
  private createdAt: number; // Session creation timestamp in seconds
  private qrReferenceSecret: string;
  private referenceId: string;
  private onQRDataUpdate?: (qrData: string, completeQR: string) => void;

  constructor(
    qrReferenceSecret: string,
    createdAt: string | Date,
    referenceId: string,
    onQRDataUpdate?: (partialQR: string, completeQR: string) => void
  ) {
    this.qrReferenceSecret = qrReferenceSecret;
    this.referenceId = referenceId;
    this.onQRDataUpdate = onQRDataUpdate;

    // Handle both string and Date inputs from backend
    if (typeof createdAt === "string") {
      this.createdAt = Math.floor(new Date(createdAt).getTime() / 1000);
    } else {
      this.createdAt = Math.floor(createdAt.getTime() / 1000);
    }
  }

  start(container: HTMLElement) {
    this.updateQRCode(container);

    // Update every 2 seconds like BankID
    this.interval = setInterval(() => {
      this.updateQRCode(container);
    }, 2000);
  }

  private async updateQRCode(container: HTMLElement) {
    const currentTime = Math.floor(Date.now() / 1000);

    // Ensure createdAt is a valid number
    if (isNaN(this.createdAt) || this.createdAt <= 0) {
      console.error("Invalid createdAt:", this.createdAt);
      return;
    }

    const qrTime = (currentTime - this.createdAt).toString();

    // Validate qrTime is not NaN
    if (qrTime === "NaN") {
      console.error("QR time calculation resulted in NaN:", {
        currentTime,
        createdAt: this.createdAt,
        difference: currentTime - this.createdAt,
      });
      return;
    }

    // Generate HMAC signature using the session's qrReferenceSecret
    const qrAuthCode = await this.generateHMACBrowser(qrTime);

    // Create QR data string following the exact format backend expects
    // Format: idfier.{referenceId}.{qrTime}.{qrAuthCode}
    const qrData = `idfier.${this.referenceId}.${qrTime}.${qrAuthCode}`;

    // Notify parent component of QR data update
    if (this.onQRDataUpdate) {
      const currentQRData = this.getCurrentQRData();
      const completeQRData = qrData; // This is the full QR data with HMAC

      if (currentQRData && completeQRData) {
        this.onQRDataUpdate(currentQRData, completeQRData);
      }
    }

    // Generate QR code
    this.generateQRCode(qrData, container);
  }

  private async generateHMACBrowser(qrTime: string): Promise<string> {
    try {
      // Use Web Crypto API for HMAC generation in browser
      const encoder = new TextEncoder();

      // Create a more robust key by hashing the secret first
      // This ensures the key meets Web Crypto API requirements
      const keyData = encoder.encode(this.qrReferenceSecret);

      // Create a hash of the secret to use as the key
      const hashBuffer = await crypto.subtle.digest("SHA-256", keyData);
      const hashArray = new Uint8Array(hashBuffer);

      // Import the hashed key
      const key = await crypto.subtle.importKey(
        "raw",
        hashArray,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );

      // Sign the data
      const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(qrTime)
      );

      // Convert to hex string
      return Array.from(new Uint8Array(signature))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    } catch (error) {
      console.error("Error generating HMAC:", error);
      // Fallback to a simple hash if Web Crypto API fails
      return this.simpleHash(qrTime + this.qrReferenceSecret);
    }
  }

  private simpleHash(input: string): string {
    // Simple hash function as fallback
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private async generateQRCode(data: string, container: HTMLElement) {
    try {
      // Create deep link URL that will open the Idfier app
      const deepLinkUrl = `idfier://auth?authData=${encodeURIComponent(data)}`;

      const qrCodeDataUrl = await QRCode.toDataURL(deepLinkUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      const img = container.querySelector("img");
      if (img) {
        img.src = qrCodeDataUrl;
      } else {
        // Create new image if none exists
        const newImg = document.createElement("img");
        newImg.src = qrCodeDataUrl;
        newImg.alt = "QR Code";
        newImg.style.maxWidth = "300px";
        container.appendChild(newImg);
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  // Public method to get current QR data string for deep linking
  getCurrentQRData(): string | null {
    if (isNaN(this.createdAt) || this.createdAt <= 0) {
      return null;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const qrTime = (currentTime - this.createdAt).toString();

    if (qrTime === "NaN") {
      return null;
    }

    // Return the QR data string without generating HMAC (for display purposes)
    // Format: idfier.{referenceId}.{qrTime}
    const result = `idfier.${this.referenceId}.${qrTime}`;
    return result;
  }
}
