import { google } from "googleapis";
import type { Auth } from "googleapis";
import * as xlsx from "xlsx";

const SCOPES = [
  "https://www.googleapis.com/auth/documents",
  "https://www.googleapis.com/auth/drive",
];

class GoogleService {
  private auth: Auth.JWT = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY,
    scopes: SCOPES,
  });

  public getSpreadSheetJSONData = async (sheetID: string) => {
    const driveApis = google.drive({
      version: "v3",
      auth: this.auth,
    });

    const spreadsheetBuffer = (
      await driveApis.files.export(
        {
          fileId: sheetID,
          mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        {
          responseType: "arraybuffer",
        }
      )
    ).data;

    const workbook = xlsx.read(spreadsheetBuffer, { type: "buffer" });

    const xlsxData = xlsx.utils.sheet_to_json(workbook.Sheets["시트1"]);
    return xlsxData;
  };
}

export const googleService = new GoogleService();
