document.getElementById('collectImages').addEventListener('click', async () => {
  const button = document.getElementById('collectImages');
  button.disabled = true;
  button.textContent = '收集中...';
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: "getImages" }, response => {
      if (response && response.images) {
        renderImageList(response.images);
      }
      button.disabled = false;
      button.textContent = '收集图片';
    });
  } catch (error) {
    console.error('Error:', error);
    button.disabled = false;
    button.textContent = '收集图片';
  }
});

document.getElementById('downloadAll').addEventListener('click', async () => {
  const checkedImages = document.querySelectorAll('input[type="checkbox"]:checked');
  for (const [index, checkbox] of Array.from(checkedImages).entries()) {
    const url = checkbox.dataset.url;
    try {
      await chrome.downloads.download({
        url: url,
        filename: getSafeFileName(url, index),
        saveAs: false
      });
    } catch (error) {
      console.error('下载失败:', error);
      alert('下载失败: ' + error.message);
    }
  }
});

function getExtension(url) {
  const match = url.match(/\.([^.]+)(?:\?.*)?$/);
  return match ? match[1].toLowerCase() : 'jpg';
}

function getSafeFileName(url, index) {
  const urlFileName = url.split('/').pop().split('?')[0];
  const ext = getExtension(url);
  const baseFileName = `image_${index + 1}`;
  
  const fileName = urlFileName.replace(/[^a-zA-Z0-9._-]/g, '') || baseFileName;
  
  const maxLength = 240;
  const truncatedName = fileName.substring(0, maxLength);
  
  return `downloads/${truncatedName}.${ext}`;
}

// 添加节流函数
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// 优化图片列表渲染
function renderImageList(images) {
  const imageList = document.getElementById('imageList');
  const fragment = document.createDocumentFragment();
  
  // 使用 IntersectionObserver 懒加载图片
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  });

  images.forEach((url, index) => {
    const div = document.createElement('div');
    div.className = 'image-item';
    
    const img = document.createElement('img');
    img.dataset.src = url; // 使用 data-src 存储URL
    img.alt = `Image ${index + 1}`;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    checkbox.dataset.url = url;
    
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = '下载';
    downloadBtn.className = 'download-btn';
    downloadBtn.onclick = throttle(async () => {
      try {
        await chrome.downloads.download({
          url: url,
          filename: getSafeFileName(url, index),
          saveAs: false
        });
      } catch (error) {
        console.error('下载失败:', error);
        alert('下载失败: ' + error.message);
      }
    }, 1000); // 1秒内只能点击一次
    
    div.appendChild(checkbox);
    div.appendChild(img);
    div.appendChild(downloadBtn);
    fragment.appendChild(div);
    
    observer.observe(img);
  });
  
  imageList.innerHTML = '';
  imageList.appendChild(fragment);
} 