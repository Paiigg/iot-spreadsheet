import { fetchSheetData } from "@/lib/googleSheets";

import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const dataSheet1 = await fetchSheetData("Data_Logger", "A2:E12");
    const dataSheet2 = await fetchSheetData("Latest_Data_Logger", "A2:E4");

    const formattedSheet1 = formatSheetData(dataSheet1);
    const formattedSheet2 = formatSheetData(dataSheet2);

    //return new Response(JSON.stringify(formattedSheet1), { status: 200 });
    return NextResponse.json(
      {
        data_logger: formattedSheet1,
        latest_data_logger: formattedSheet2,
      },
      { status: 200 }
    );
    // NextResponse.json({
    //   data_logger: formattedSheet1,
    //   latest_data_logger: formattedSheet2,
    // });
  } catch (error) {
    console.error("Error fetching data:", error);
    return new Response(JSON.stringify(null), { status: 500 });
  }
}

function formatSheetData(rows) {
  if (!rows || rows.length === 0) {
    return [];
  }

  const headers = rows[0].map((header) => {
    switch (header.toLowerCase()) {
      case "mesin":
        return "id";
      case "date":
        return "date";
      case "time":
        return "time";
      case "temperature (°c)":
        return "celcius";
      case "temperature (°f)":
        return "fahrenheit";
      default:
        return header.toLowerCase().replace(/ /g, "_");
    }
  });

  return rows.slice(1).map((row) => {
    return headers.reduce((acc, header, index) => {
      acc[header] = row[index];
      return acc;
    }, {});
  });
}
