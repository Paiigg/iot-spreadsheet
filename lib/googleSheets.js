import { google } from "googleapis";
// import fs from "fs";
// import path from "path";
// import dotenv from "dotenv";

// dotenv.config();

const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, SPREADSHEET_ID } = process.env;

const getClient = async () => {
  const client = new google.auth.JWT({
    email: GOOGLE_CLIENT_EMAIL,
    key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Replace newlines if escaped
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  await client.authorize();
  return google.sheets({ version: "v4", auth: client });
};

export const fetchSheetData = async (sheetName, range) => {
  const sheets = await getClient();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!${range}`,
  });

  return response.data.values;
};
