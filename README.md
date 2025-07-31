# Dark Pattern Watchdog

**Dark Pattern Watchdog** is an open-source browser extension that detects potentially manipulative / toxic UI wording (dark patterns) on web pages and lets users report them as GitHub issues. It integrates with a lightweight toxicity detection API (powered by TensorFlow.js) and supports flagging, context capture, and issue submission.


## Features
- Detects toxic or manipulative text (insults, confirmshaming, fake urgency).
- Auto-fills GitHub issue with:
  - Detected labels
  - Page URL
  - Timestamp
- Submit report to your GitHub repo with a Personal Access Token.

---

## Setup

### 1. Load the Extension
1. Clone or download this repo.
2. Open `chrome://extensions` → Enable **Developer mode** → **Load unpacked** → Select this folder.

### 2. Configure
- In `background.js`, ensure your API URL is: 
https://dark-pattern-extension.onrender.com/analyze

- Enter your GitHub Personal Access Token in the popup when submitting an issue.

---

## Usage
1. Navigate to a webpage.
2. Click the extension → Paste or highlight suspicious text.
3. **Check Toxicity** → See detected labels.
4. **Submit to GitHub** → Creates an issue in your repo.

---

## Tech Stack
- Chrome Extensions Manifest V3
- TensorFlow.js Toxicity model (hosted API)
- Node.js + Express backend for NLP
- GitHub REST API for issue creation

---

## License
MIT

