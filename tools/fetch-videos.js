const fs = require('fs');
const https = require('https');

const API_KEY = process.env.YOUTUBE_API_KEY; // Set this in your GitHub Actions secrets as YOUTUBE_API_KEY
const CHANNEL_ID = 'UCo3Z-t-u4yfE5omo8Q_cl5Q'; // Replace with your actual channel ID

// YouTube API endpoint for listing channel videos (most recent first)
const maxResults = 10; // Number of videos to fetch

const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${maxResults}&type=video`;

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  if (!API_KEY) {
    console.error('ERROR: YOUTUBE_API_KEY environment variable not set');
    process.exit(1);
  }

  try {
    const data = await fetchJson(url);
    if (!data.items || data.items.length === 0) {
      console.error('No videos found for this channel.');
      process.exit(1);
    }

    // Map the results to a simpler format
    const videos = data.items.map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails.high.url,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));

    // Write latest video (first one)
    fs.writeFileSync('data/latest-video.json', JSON.stringify(videos[0], null, 2));

    // Write all videos
    fs.writeFileSync('data/videos.json', JSON.stringify(videos, null, 2));

    console.log('Successfully updated latest-video.json and videos.json');
  } catch (error) {
    console.error('Failed to fetch videos:', error);
    process.exit(1);
  }
}

main();
