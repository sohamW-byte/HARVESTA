
import { NextResponse } from "next/server";
import { config } from 'dotenv';

// Explicitly load environment variables from .env file
config();

export async function POST(req: Request) {
  try {
    const { text, targetLang } = await req.json();

    if (!text || !targetLang) {
      return NextResponse.json({ error: 'Missing text or targetLang' }, { status: 400 });
    }
    
    const apiKey = process.env.SARVAM_API_KEY;

    if (!apiKey) {
      console.error("Sarvam API key is not configured.");
      return NextResponse.json({ error: 'Server configuration error: Translation service API key not found.' }, { status: 500 });
    }

    const response = await fetch("https://api.sarvam.ai/v1/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        source_language: "en", // Assuming source is always English
        target_language: targetLang,
        text_list: [text],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Translation API Error:", errorBody);
      return NextResponse.json({ error: `Translation API failed: ${response.statusText}`, details: errorBody }, { status: response.status });
    }

    const data = await response.json();

    const translatedText = data.translations?.[0]?.text || text;

    return NextResponse.json({ translatedText });

  } catch (error: any) {
    console.error("Internal API Error:", error);
    return NextResponse.json({ error: 'An internal error occurred.', details: error.message }, { status: 500 });
  }
}
