import * as cheerio from 'cheerio';
const productName = 'ナイシトール'; 
const searchUrl = `https://search.yahoo.co.jp/image/search?p=${encodeURIComponent(productName)}`;

console.log("Fetching image from Yahoo Search...");
try {
  const res = await fetch(searchUrl, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" } });
  const html = await res.text();
  const $ = cheerio.load(html);
  
  let imgUrl = '';
  $('img').each((i, el) => {
    const src = $(el).attr('src');
    // Yahoo image search thumbnails usually start with https://msp.c.yimg.jp/
    if (src && src.includes('yimg.jp') && !imgUrl) {
        imgUrl = src;
    }
  });
  console.log("Found Image URL:", imgUrl);
} catch(e) {
  console.error(e);
}
