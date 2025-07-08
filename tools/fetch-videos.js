const fs = require('fs');
const fetch = require('node-fetch');
const xml2js = require('xml2js');

const channelId = 'UCo3Z-t-u4yfE5omo8Q_cl5Q';
const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
const outputPath = 'data/videos.json';

async function fetchYouTubeVideos() {
  try {
    const res = await fetch(rssUrl);
    const xml = await res.text();

    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xml);

    const entries = result.feed.entry || [];

    const videos = entries.map(entry => ({
      id: entry['yt:videoId'][0],
      title: entry.title[0],
      published: entry.published[0],
      link: entry.link[0].$.href
    }));

    // Save to JSON
    fs.writeFileSync(outputPath, JSON.stringify(videos, null, 2));
    console.log(`✅ Saved ${videos.length} videos to ${outputPath}`);
  } catch (err) {
    console.error('❌ Failed to fetch or parse videos:', err);
    process.exit(1);
  }
}

fetchYouTubeVideos();
