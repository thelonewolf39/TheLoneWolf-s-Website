// tools/fetch-videos.js
const fs = require('fs');
const https = require('https');

const CHANNEL_ID = 'UCo3Z-t-u4yfE5omo8Q_cl5Q';  // Your YouTube channel ID here
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

https.get(FEED_URL, res => {
  let xml = '';
  res.on('data', chunk => xml += chunk);
  res.on('end', () => {
    const match = xml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    if (match) {
      const videoId = match[1];
      const output = { id: videoId };

      // Make sure 'data' folder exists
      fs.mkdirSync('data', { recursive: true });
      // Write latest video ID to JSON file
      fs.writeFileSync('data/latest-video.json', JSON.stringify(output, null, 2));

      console.log(`✅ Latest video ID: ${videoId}`);
    } else {
      console.error('❌ No video ID found in feed.');
      process.exit(1);
    }
  });
}).on('error', err => {
  console.error('❌ Error fetching YouTube feed:', err);
  process.exit(1);
});
