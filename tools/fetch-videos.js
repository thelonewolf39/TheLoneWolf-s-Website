// tools/fetch-videos.js
const fs = require('fs');
const https = require('https');
const xml2js = require('xml2js');

// CONFIG
const CHANNEL_ID = 'UCo3Z-t-u4yfE5omo8Q_cl5Q';
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

https.get(FEED_URL, res => {
  let xml = '';
  res.on('data', d => (xml += d));
  res.on('end', () => {
    xml2js.parseString(xml, (err, result) => {
      if (err) {
        console.error('XML Parse Error:', err);
        process.exit(1);
      }

      const entries = result.feed.entry;
      if (!entries || entries.length === 0) {
        console.error('No videos found');
        process.exit(1);
      }

      const videos = entries.map(v => ({
        id: v['yt:videoId'][0],
        title: v.title[0],
        published: v.published[0],
        link: v.link[0].$.href
      }));

      fs.mkdirSync('data', { recursive: true });
      fs.writeFileSync('data/latest-video.json', JSON.stringify({ id: videos[0].id }, null, 2));
      fs.writeFileSync('data/videos.json', JSON.stringify(videos, null, 2));
      console.log(`✅ Fetched ${videos.length} videos`);
    });
  });
}).on('error', e => {
  console.error('Request error:', e);
  process.exit(1);
});
