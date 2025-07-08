const fs = require('fs');
const https = require('https');

const CHANNEL_ID = 'UCo3Z-t-u4yfE5omo8Q_cl5Q';  // ← your channel ID
const FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${UCo3Z-t-u4yfE5omo8Q_cl5Q}`;

https.get(FEED, res => {
  let xml = '';
  res.on('data', d => (xml += d));
  res.on('end', () => {
    const match = xml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    if (!match) process.exit(1);
    fs.mkdirSync('data', { recursive: true });
    fs.writeFileSync('data/latest-video.json',
      JSON.stringify({ id: match[1] }, null, 2)
    );
  });
}).on('error', e => process.exit(1));
