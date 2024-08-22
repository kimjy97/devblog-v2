import { google } from 'googleapis';
import { hasKorean, removeEmojis, removeMarkdown } from '@/utils/chat';
import { ResponseError, ResponseSuccess } from '@/constants/api';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const passedValue = await new Response(req.body).text();
  const { text } = JSON.parse(passedValue);

  const jwtClient = new google.auth.JWT(
    process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/cloud-platform']
  );

  try {
    const tokens = await jwtClient.authorize();
    const accessToken = tokens.access_token;
    const inputText = removeMarkdown(removeEmojis(text));
    const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: { text: inputText },
        voice: {
          languageCode: hasKorean(inputText) ? 'ko-KR' : 'en-US',
          name: hasKorean(inputText) ? 'ko-KR-Wavenet-D' : 'en-US-Wavenet-D',
        },
        audioConfig: { audioEncoding: 'MP3' }
      })
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    const audioContent = data.audioContent;

    return ResponseSuccess(true, { url: audioContent });
  } catch (error: any) {
    return ResponseError(500, 'audio fetch error', error);
  }
}

