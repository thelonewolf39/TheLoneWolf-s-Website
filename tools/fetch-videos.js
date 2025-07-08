// tools/fetch-videos.js
const fs = require('fs');
const https = require('https');

// Replace with your actual channel ID
const CHANNEL_ID = 'UCo3Z-t-u4yfE5omo8Q_cl5Q';
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

https.get(FEED_URL, res => {
  let xml = '';
  res.on('data', chunk => xml += chunk);
  res.on('end', () => {
    const match = xml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    if (match) {
      const videoId = match[1];
      const output = { id: videoId };

      fs.mkdirSync('data', { recursive: true });
      fs.writeFileSync('data/latest-video.json', JSON.stringify(output, null, 2));

      console.log(`✅ Latest video ID: ${videoId}`);
    } else {
      console.error('❌ No video ID found');
      process.exit(1);
    }
  });
}).on('error', err => {
  console.error('❌ Fetch failed:', err);
  process.exit(1);
});
