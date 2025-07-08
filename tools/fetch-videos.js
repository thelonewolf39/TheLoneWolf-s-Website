const https = require('https');
const fs = require('fs');
const xml2js = require('xml2js');

const channelId = 'UCo3Z-t-u4yfE5omo8Q_cl5Q'; // your channel ID
const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

https.get(rssUrl, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    xml2js.parseString(data, (err, result) => {
      if (err) {
        console.error('Failed to parse XML', err);
        return;
      }
      try {
        const entries = result.feed.entry || [];
        const videos = entries.map(entry => ({
          id: entry['yt:videoId'][0],
          title: entry.title[0],
          published: entry.published[0]
        }));

        fs.writeFileSync('data/videos.json', JSON.stringify(videos, null, 2));
        console.log('videos.json updated from RSS feed!');
      } catch (e) {
        console.error('Error extracting videos', e);
      }
    });
  });
}).on('error', (e) => {
  console.error('Error fetching RSS:', e);
});
