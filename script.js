const blip = new Audio("blip.mp3"); // make sure it’s MP3 or OGG
blip.preload = "auto";

async function getRandomSubreddit() {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const query =
    letters[Math.floor(Math.random() * letters.length)] +
    letters[Math.floor(Math.random() * letters.length)];

  try {
    const response = await fetch(
      `https://www.reddit.com/subreddits/search.json?q=${query}&limit=100`
    );
    const data = await response.json();
    const subs = data.data.children;

    if (subs.length === 0) return null;

    const randomSub = subs[Math.floor(Math.random() * subs.length)].data.display_name;
    return randomSub;
  } catch (error) {
    console.error("Error fetching subreddit:", error);
    return null;
  }
}

document.getElementById("generate-btn").addEventListener("click", async () => {
  const resultElement = document.getElementById("result");
  resultElement.textContent = "Spinning the subreddit wheel... 🎰";
  resultElement.classList.add("loading");

  let subreddit = null;
  while (!subreddit) {
    subreddit = await getRandomSubreddit();
  }

  // Subreddit found — play the blip now
  blip.currentTime = 0;
  blip.play().catch(err => console.warn("Blip blocked:", err));

  resultElement.classList.remove("loading");
  resultElement.innerHTML = `<a href="https://www.reddit.com/r/${subreddit}" target="_blank">r/${subreddit}</a>`;
});
