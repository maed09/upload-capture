import pdfParse, { Result } from "pdf-parse";
import axios from "axios";
import { env } from "../../utils/envConfig";

export class FileService {
  async parsePDF(fileBuffer: Buffer): Promise<string> {
    const data: Result = await pdfParse(fileBuffer);
    return data.text;
  }

  async inspect(text: string): Promise<string> {
    const apiResponse = await axios.post(
      env.PROMPT_SECURITY_API_URL as string,
      { prompt: text },
      {
        headers: {
          "Content-Type": "application/json",
          "APP-ID": env.PROMPT_SECURITY_APP_ID,
        }
      });
    return apiResponse?.data?.result?.prompt?.violating_findings || "";
  }
}

export const fileService = new FileService();