import { NextResponse } from "next/server";

const SITE_HOST = "medicalbillreader.com";
const KEY = process.env.INDEXNOW_API_KEY ?? "1af58049462445718b7a9a3fbd66f393";

const URLS = [
  `https://${SITE_HOST}/`,
  `https://${SITE_HOST}/about`,
  `https://${SITE_HOST}/contact`,
  `https://${SITE_HOST}/privacy`,
  `https://${SITE_HOST}/terms`,
];

export async function POST() {
  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: SITE_HOST,
        key: KEY,
        keyLocation: `https://${SITE_HOST}/${KEY}.txt`,
        urlList: URLS,
      }),
    });

    if (response.ok || response.status === 202) {
      return NextResponse.json(
        { success: true, submitted: URLS.length },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, status: response.status, error: await response.text() },
      { status: 502 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
