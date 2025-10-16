import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, targetLang } = await req.json();

    if (!text || !targetLang) {
      return NextResponse.json({ error: 'Missing text or targetLang' }, { status: 400 });
    }
    
    // NOTE: The Sarvam API endpoint and payload structure are assumed based on your instructions.
    // This may need to be adjusted based on their official documentation.
    const response = await fetch("https://api.sarvam.ai/v1/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // The API key is securely accessed from environment variables on the server.
        "Authorization": `Bearer ${process.env.SARVAM_API_KEY}`,
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

    // Assuming the response structure has a 'translations' array.
    // This might need adjustment.
    const translatedText = data.translations?.[0]?.text || text;

    return NextResponse.json({ translatedText });

  } catch (error: any) {
    console.error("Internal API Error:", error);
    return NextResponse.json({ error: 'An internal error occurred.', details: error.message }, { status: 500 });
  }
}
