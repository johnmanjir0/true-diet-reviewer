import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const KEY = process.env.GEMINI_API_KEY;

const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${KEY}`);
const data = await res.json();
if (data.models) {
  const flashModels = data.models
    .filter(m => m.name.includes('flash') || m.name.includes('pro'))
    .filter(m => m.supportedGenerationMethods?.includes('generateContent'));
  console.log("=== 利用可能なモデル ===");
  flashModels.forEach(m => console.log(m.name));
} else {
  console.log(JSON.stringify(data, null, 2));
}
