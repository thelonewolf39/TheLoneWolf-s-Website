const fs = require('fs');
const https = require('https');
const xml2js = require('xml2js');

const CHANNEL_ID = 'UCo3Z-t-u4yfE5omo8Q_cl5Q'; // Your YouTube channel ID
const MAX_RESULTS = 10;

const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

function fetchXML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
  });
}

async function parseXML(xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

async function main() {
  try {
    const xml = await fetchXML(RSS_URL);
    const parsed = await parseXML(xml);

    const entries = parsed.feed.entry || [];
    const videos = entries.slice(0, MAX_RESULTS).map(entry => ({
      videoId: entry['yt:videoId'][0],
      title: entry.title[0],
      link: entry.link[0].$.href,
      publishedAt: entry.published[0],
      thumbnail: `https://i.ytimg.com/vi/${entry['yt:videoId'][0]}/hqdefault.jpg`,
      description: entry['media:group'][0]['media:description'][0]
    }));

    if (videos.length === 0) {
      console.error('No videos found in RSS feed.');
      process.exit(1);
    }

    // Save latest video (first one)
    fs.writeFileSync('data/latest-video.json', JSON.stringify(videos[0], null, 2));

    // Save all videos
    fs.writeFileSync('data/videos.json', JSON.stringify(videos, null, 2));

    console.log('Successfully updated latest-video.json and videos.json');
  } catch (error) {
    console.error('Error fetching or parsing RSS feed:', error);
    process.exit(1);
  }
}

main();
