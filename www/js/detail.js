document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  if (!postId) {
    alert("参数错误：未找到物品信息！");
    window.location.href = "index.html";
    return;
  }

  const post = getPostById(postId);
  if (!post) {
    alert("该物品不存在或已被删除！");
    window.location.href = "index.html";
    return;
  }

  renderDetail(post);
  bindEvents(post);
});

function renderDetail(post) {
  // 格式化时间为 "2026-10-08 10:20"
  const d = new Date(post.publishTime);
  const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

  document.getElementById('detail-title').textContent = post.title;
  document.getElementById('detail-time').textContent = dateStr + (post.type === "found" ? " 拾取" : " 丢失");
  document.getElementById('detail-location').textContent = post.location;
  
  // 采用默认发帖人，如果没写则默认“同学A”模拟设计图
  document.getElementById('detail-publisher').textContent = post.publisher || "同学A";
  document.getElementById('detail-desc').textContent = post.description;

  // 动态渲染顶部标签颜色 (招领为绿，寻物为红，次标签为灰)
  const typeLabel = post.type === "found" ? "招领" : "寻物";
  const typeColor = post.type === "found" ? "#4ade80" : "#ff3b30";
  const typeBg = post.type === "found" ? "#eafff0" : "#ffebe9";
  
  document.getElementById('detail-tags').innerHTML = `
    <span style="color:${typeColor}; background:${typeBg};">${typeLabel}</span>
    <span style="color:#666; background:#f5f6f8;">${post.category}</span>
  `;

  // 大图与 Emoji 优雅降级
  const mediaContainer = document.getElementById('detail-media');
  if (post.image && post.image.trim() !== "") {
    mediaContainer.innerHTML = `<img src="${post.image}" alt="${post.title}" onerror="this.outerHTML='<div class=\\'emoji-fallback\\'>📦</div>'">`;
  } else {
    const icons = { "数码电子": "🎧", "日常用品": "🧴", "卡片证件": "💳", "交通工具": "🚲", "其他": "📦" };
    const fallbackIcon = icons[post.category] || "📦";
    mediaContainer.innerHTML = `<div class="emoji-fallback">${fallbackIcon}</div>`;
  }
}

function bindEvents(post) {
  // 顶部返回首页
  document.getElementById('top-back-btn').addEventListener('click', () => {
    window.location.href = "index.html";
  });
  
  // 底部横幅返回首页
  document.getElementById('banner-back-btn').addEventListener('click', () => {
    window.location.href = "index.html";
  });

  const getContactBtn = document.getElementById('get-contact-btn');
  const safetyModal = document.getElementById('safety-modal');
  const cancelBtn = document.getElementById('cancel-modal-btn');
  const confirmBtn = document.getElementById('confirm-modal-btn');
  const successBanner = document.getElementById('success-banner');

  // 如果已经解决，按钮变灰
  if (post.status === "resolved") {
    getContactBtn.textContent = "该物品已解决";
    getContactBtn.style.background = "#f5f6f8";
    getContactBtn.style.color = "#999999";
    getContactBtn.style.cursor = "not-allowed";
    return;
  }

  // 1. 点击获取联系方式 -> 弹出安全须知
  getContactBtn.addEventListener('click', () => {
    safetyModal.classList.remove('hidden');
  });

  // 2. 拒绝 -> 关闭弹窗
  cancelBtn.addEventListener('click', () => {
    safetyModal.classList.add('hidden');
  });

  // 3. 我已了解 -> 关闭弹窗，底部丝滑滑出成功横幅
  confirmBtn.addEventListener('click', () => {
    safetyModal.classList.add('hidden');
    
    // 给一点点延迟，让弹窗消失后再滑出横幅，动画更高级
    setTimeout(() => {
      successBanner.classList.remove('hidden');
      
      // 把原来的 0.5 改成 0，原按钮就会完全隐身，给新弹窗腾出视觉空间
      getContactBtn.style.opacity = "0"; 
      getContactBtn.style.pointerEvents = "none";
    }, 200);
  });
}