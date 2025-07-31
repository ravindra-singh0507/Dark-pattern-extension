// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "analyzeText") {
    const apiUrl = "https://dark-pattern-extension.onrender.com/analyze";
    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message.text })
    })
      .then(async (res) => {
        let data;
        try {
          data = await res.json();
        } catch (e) {
          throw new Error("Invalid JSON from toxicity API");
        }
        const preds = data.predictions || [];
        const matched = preds
          .filter(p => p.results?.[0]?.match)
          .map(p => p.label);
        sendResponse({ labels: matched, raw: preds });
      })
      .catch(err => sendResponse({ error: err.message || "Fetch error" }));
    return true; // keep channel open for async response
  }
});
