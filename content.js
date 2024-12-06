chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getImages") {
    const uniqueImages = new Set();
    
    const imgElements = document.querySelectorAll('img');
    
    for (const img of imgElements) {
      let imageUrl = '';
      
      if (img.srcset) {
        let maxWidth = 0;
        for (const src of img.srcset.split(',')) {
          const [url, width] = src.trim().split(' ');
          const parsedWidth = width ? parseInt(width) : 0;
          if (parsedWidth > maxWidth) {
            maxWidth = parsedWidth;
            imageUrl = url;
          }
        }
      }
      
      imageUrl = imageUrl || img.src;
      
      if (imageUrl && imageUrl.startsWith('http')) {
        uniqueImages.add(imageUrl);
      }
    }
    
    sendResponse({ images: Array.from(uniqueImages) });
  }
}); 