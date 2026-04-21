import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('No API Key found');
    return;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // v1betaでリストを取得してみる
  try {
    console.log('--- v1beta models ---');
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('v1beta list failed', e);
  }

  // v1でもリストを取得してみる
  try {
    console.log('--- v1 models ---');
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('v1 list failed', e);
  }
}

listModels();
