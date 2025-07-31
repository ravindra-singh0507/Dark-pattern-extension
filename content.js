// content.js
const suspicious = [
  "only today",
  "last chance",
  "confirmshaming",
  "you’ll miss out",
  "limited time",
  "exclusive deal",
  "subscribe now",
  "forced continuity"
];

function scanForPatterns() {
  const text = document.body.innerText.toLowerCase();
  const found = suspicious.filter(s => text.includes(s));
  if (found.length) {
    console.log("Possible dark patterns:", found);
    // Optionally: send message to popup or background if you want aggregated UI
  }
}

scanForPatterns();
