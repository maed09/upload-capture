# 📤 PDF Upload Interceptor Chrome Extension & API

This project includes a **Chrome Extension** and an **Express.js API** that work together to capture PDF file uploads to ChatGPT in chrome, send them to a API, and forward for content inspection to a 3rd-party service.

---

## 🔧 Features

### ✅ Chrome Extension
- Captures user-uploaded PDF files from `<input type="file">` elements
- Sends the file to a background service worker
- Uploads the file to your API using `FormData`
- Shows success or failure using `alert()`
- Supports domain-level restrictions via `manifest.json`

### ✅ Express.js API
- Receives files via `multipart/form-data`
- Parses PDF text using `pdf-parse`
- Forwards extracted content to a 3rd-party API
- Rate-limited per API key (default: 100 req/hour)
- Docker-ready for deployment

---

## 🚀 Getting Started

### 🔌 Chrome Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer Mode**
3. Click **"Load unpacked"** and select the `chrome-extension/` folder

### 🌐 Express.js API

1. Create a .env file in the same directory.
2. Build & Run.
From the api/ folder (where Dockerfile and docker-compose.yml live):

docker-compose up --build
3. Stop & Remove

docker-compose down

---

## 📤 How It Works
1.	A user uploads a PDF on ChatGPT in chrome
2.	The extension intercepts the file
3.	It sends the file to the background script
4.	The background script uploads the file to API
5.	Express API:
	- Parses the file
	-	Forwards extracted text to a 3rd-party endpoint for inspection

---

## 🛡️ Security
- 🚦 Rate-limited per API key (default: 100 req/hour)
- 🧼 Only allows PDFs (application/pdf)
- 📦 Maximum file size 5 MB
-	🧠 In-memory processing (multer.memoryStorage)

---

## ✅ To Do
- Add test unit and e2e
-	Setup production Dockerfile
-	JWT-based or API key authentication
- CI/CD setup
- Allow multiple file uploads
- Monitoring (Datadog, Sentry)
- Metrics (Prometheus metrics or log-level stats for volume monitoring)

---

## Performance Improvments

### ⚡ Chrome Extension Performance

1. Avoid FileReader.readAsDataURL()
	-	Base64 adds ~33% payload overhead.
	-	✅ Use readAsArrayBuffer() instead and transfer raw bytes.

 2. Debounce Rapid File Events
	-	Prevent duplicate sends if a user selects multiple files quickly.
	-	Add a debounce in content.js or ignore repeated changes within 1 second.

 3. Avoid Blocking Alerts
	-	Replace alert() with non-blocking UI (chrome.notifications or DOM tooltip).
	-	Alerts block the thread and delay uploads.

### 🚀 Express API Performance

1. Use Streaming Where Possible
	-	✅ Use streams to avoid holding large files in memory.
	-	Currently you use multer.memoryStorage(), good for small files (PDFs <5MB).

2. Connection Keep-Alive
  - Enable HTTP keep-alive to improve multiple rapid connections. 

3. Compress Response & Enable Gzip.

4. Minimize pdf-parse Overhead. Maybe parse pdf on frontend

5. Adding Redis caching
  - Avoid re-parsing the same PDF file
  - Avoid sending duplicate content downstream


