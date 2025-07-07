document.addEventListener("DOMContentLoaded", () => {
  const CHANNEL_ID = "UCo3Z-t-u4yfE5omo8Q_cl5Q";
  const PROXY = "https://corsproxy.io/?";
  const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
  const iframe = document.getElementById("latestYtVideo");

  async function loadLatestVideo() {
    try {
      const response = await fetch(PROXY + encodeURIComponent(FEED_URL));
      const text = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, "application/xml");
      const entry = xml.querySelector("entry > id");
      if (entry) {
        const videoId = entry.textContent.split(":").pop();
        iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0`;
      } else {
        console.warn("No videos found in feed");
      }
    } catch (err) {
      console.error("Error loading latest video:", err);
    }
  }

  loadLatestVideo();
  setInterval(loadLatestVideo, 1000 * 60 * 30); // Refresh every 30 mins
});
