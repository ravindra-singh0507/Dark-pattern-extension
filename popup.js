// popup.js
const checkBtn = document.getElementById("check-btn");
const reportText = document.getElementById("reportText");
const output = document.getElementById("output");
const submitBtn = document.getElementById("submitIssue");
const issueTitleInput = document.getElementById("issueTitle");
const issueBodyInput = document.getElementById("issueBody");
const tokenInput = document.getElementById("githubToken");
const statusMsg = document.getElementById("statusMessage");

let currentPageURL = "";

// Helpers
async function fetchActiveTabUrl() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        resolve(tabs[0].url || "");
      } else {
        resolve("");
      }
    });
  });
}

function getKolkataTimestamp() {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function buildIssueTemplate(detectedLabels, phrase) {
  return `**Description:**  
The extension flagged the following text as a potential dark pattern / toxic content: "${phrase}"

**Detected labels:**  
${detectedLabels.length ? detectedLabels.join(", ") : "none"}

**Page URL:**  
${currentPageURL}

**Timestamp:**  
${getKolkataTimestamp()}

**Reproduction Steps:**  
1. Open ${currentPageURL}  
2. Observe the text/content containing "${phrase}".  
3. Open the extension and click "Check Toxicity".  
4. The extension reports ${detectedLabels.length ? detectedLabels.join(" and ") : "no toxicity"}.

**Notes (optional):**  
Provide any additional context here.
`;
}

// Pre-fetch current tab URL
fetchActiveTabUrl().then((url) => {
  currentPageURL = url;
});

checkBtn.addEventListener("click", async () => {
  const text = reportText.value.trim();
  if (!text) {
    output.textContent = "Enter text to analyze.";
    return;
  }

  output.textContent = "Analyzing...";
  // refresh URL in case it changed
  currentPageURL = await fetchActiveTabUrl();

  chrome.runtime.sendMessage({ action: "analyzeText", text }, (response) => {
    if (response.error) {
      output.textContent = `Error: ${response.error}`;
      return;
    }

    const labels = response.labels || [];
    if (labels.length) {
      output.textContent = `⚠️ Detected: ${labels.join(", ")}`;
    } else {
      output.textContent = "✅ No toxicity detected.";
    }

    // Build preview phrase for title (shorten if long)
    const phrasePreview = text.length > 30 ? text.slice(0, 27) + "..." : text || "unspecified";

    // Auto-fill title/body if empty or override
    if (!issueTitleInput.value.trim()) {
      issueTitleInput.value = `Toxic phrasing detected: "${phrasePreview}"`;
    }
    issueBodyInput.value = buildIssueTemplate(labels, phrasePreview);
  });
});

submitBtn.addEventListener("click", async () => {
  const title = issueTitleInput.value.trim() || "⚠️ Dark Pattern Report";
  const body = issueBodyInput.value.trim() || reportText.value.trim();
  const token = tokenInput.value.trim();
  if (!body) {
    statusMsg.textContent = "Provide description for the issue.";
    return;
  }
  if (!token) {
    statusMsg.textContent = "GitHub token required.";
    return;
  }

  statusMsg.textContent = "Submitting...";
  const repo = "ravindra-singh0507/Dark-pattern-extension"; // your repo

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/issues`, {
      method: "POST",
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, body, labels: ["user-submitted"] })
    });

    const data = await res.json();
    if (res.ok) {
      statusMsg.innerHTML = `✅ Issue created: <a href="${data.html_url}" target="_blank">View</a>`;
    } else {
      statusMsg.textContent = `Error: ${data.message || "failed"}`;
    }
  } catch (e) {
    statusMsg.textContent = `Network error: ${e.message}`;
  }
});
