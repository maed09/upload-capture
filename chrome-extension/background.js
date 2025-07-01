chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'file-upload') {
    const { filename, mime, dataUrl } = message;

    // Extract base64 part from dataURL
    const base64 = dataUrl.split(',')[1];

    // Convert base64 to binary buffer
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    // Create Blob
    const blob = new Blob([bytes], { type: mime });

    const formData = new FormData();
    formData.append('file', blob, filename);

    fetch('http://localhost:3000/file/inspect', {
      method: 'POST',
      body: formData,
    })

    .then(response => {
        if (!response.ok) throw new Error('Upload failed');
        return response.json();
      })
      .then(({ data }) => {
        sendResponse(
          {
            success: true,
            ...(data?.length ? { message: data } : {}),
          },
        );
      })
      .catch(err => {
        sendResponse({ success: false, error: err.message });
      });

    // Required for async response
    return true;
  }
});