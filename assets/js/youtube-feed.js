/* Replace this once with your own UC… channel ID */
const CHANNEL_ID = "UCo3Z-t-u4yfE5omo8Q_cl5Q";

/* Shared helpers ------------------------------------------------------- */
const FEED   = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const PROXY  = "https://api.allorigins.win/raw?url=";      // free CORS passthrough

async function fetchFeed() {
  const xmlText = await fetch(PROXY + encodeURIComponent(FEED)).then(r => r.text());
  return new DOMParser().parseFromString(xmlText, "application/xml");
}

/* Export tiny utilities */
export async function getLatestVideoId() {
  const xml = await fetchFeed();
  return xml.querySelector("entry > id")?.textContent.split(":").pop() ?? null;
}

export async function getRecentVideos(max = 10) {
  const xml = await fetchFeed();
  return [...xml.querySelectorAll("entry")].slice(0, max).map(e => ({
    id:  e.querySelector("id").textContent.split(":").pop(),
    title: e.querySelector("title").textContent,
    published: new Date(e.querySelector("published").textContent),
  }));
}
