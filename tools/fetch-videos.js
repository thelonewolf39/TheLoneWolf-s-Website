const https = require('https');
const fs = require('fs');
const path = require('path');

const channelId = 'UCo3Z-t-u4yfE5omo8Q_cl5Q'; // Your channel ID
const maxResults = 5; // number of videos to fetch

// This function fetches the channel uploads RSS feed in XML and parses it
function fetchVideos() {
  return new Promise((resolve, reject) => {
    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

    https.get(url, (res) => {
      let data = '';

      if (res.statusCode !== 200) {
        reject(new Error(`Request Failed. Status Code: ${res.statusCode}`));
        res.resume();
        return;
      }

      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          // parse XML (simple way, or you can use xml2js)
          const parseString = require('xml2js').parseString;
          parseString(data, (err, result) => {
            if (err) reject(err);

            const entries = result.feed.entry || [];
            const videos = entries.slice(0, maxResults).map(e => ({
              id: e['yt:videoId'][0],
              title: e.title[0],
              published: e.published[0],
              link: e.link[0].$.href,
            }));

            resolve(videos);
          });
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', (e) => reject(e));
  });
}

async function main() {
  try {
    const videos = await fetchVideos();

    if (!videos || videos.length === 0) {
      console.error('No videos found');
      process.exit(1);
    }

    const outputPath = path.join(__dirname, '..', 'data', 'videos.json');
    fs.writeFileSync(outputPath, JSON.stringify(videos, null, 2));
    console.log('Videos JSON updated successfully');
  } catch (error) {
    console.error('Failed to fetch videos:', error);
    process.exit(1);
  }
}

main();
