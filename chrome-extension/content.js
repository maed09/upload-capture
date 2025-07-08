document.addEventListener('change', event => {
  const input = event.target;

  if (input.tagName === 'INPUT' && input.type === 'file' && input.files.length > 0) {
    const file = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof chrome?.runtime?.sendMessage === 'function') {
        return chrome.runtime.sendMessage({
          type: 'file-upload',
          filename: file.name,
          mime: file.type,
          dataUrl: reader.result,
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.log('Extension error: ' + chrome.runtime.lastError.message);
          } else if (response.success) {
            if (response.message) {
              alert(`❌ File "${file.name}" contains vulnerabilities: ${response.message}`);
            }
            console.log(`✅ File "${file.name}" uploaded successfully!`);
          } else {
            console.log(`❌ Validation error failed: ${response.error}`);
          }
        });
      } else {
        console.warn('chrome.runtime.sendMessage is not available');
      }
    };

    reader.readAsDataURL(file);
  }
});