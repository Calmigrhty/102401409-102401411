let currentType = "all";

// 辅助函数：计算“几小时前/几天前” (让界面更有真实感)
// 因为 initial_posts 里的发布时间是 "2026-10-07 13:45" 这种格式
function getTimeAgo(timeStr) {
  const publishTime = new Date(timeStr).getTime();
  const diffMs = Math.max(0, Date.now() - publishTime);
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 1) return "刚刚";
  if (diffHours < 24) return `${diffHours}小时前`;
  return `${Math.floor(diffHours / 24)}天前`;
}

// 将帖子显示到首页
function renderPosts(type = "all") {
  const postList = document.getElementById("post-list");
  const posts = getPosts();

  const filteredPosts =
    posts.filter(post =>
      post.status === "active" && (type === "all" || post.type === type)
    );

  postList.innerHTML = "";

  if (filteredPosts.length === 0) {
    postList.innerHTML = `
      <p class="empty-tip">暂无相关信息</p>
    `;
    return;
  }

  filteredPosts.forEach(post => {
    const card = document.createElement("div");
    card.className = "post-card";
    const timeAgo = getTimeAgo(post.publishTime);
    
    // 1. 复用队友写的图标映射函数
    const icons = {
      "数码电子": "🎧",
      "日常用品": "🧴",
      "卡片证件": "💳",
      "交通工具": "🚲",
      "其他": "📦"
    };
    const fallbackIcon = icons[post.category] || "📦";

    // 2. 动态判断：如果有图片就用 img 标签，如果没有就用 emoji 的 div
    let mediaContent = "";
    if (post.image && post.image.trim() !== "") {
      // 有图片时的逻辑（保留了 onerror 容错，万一图片路径写错了也能退回到 emoji）
      mediaContent = `<img src="${post.image}" alt="${post.title}" class="post-card-img" onerror="this.outerHTML='<div class=\\'post-icon-fallback\\'>${fallbackIcon}</div>'">`;
    } else {
      // 没上传图片时的逻辑：直接渲染大号 Emoji
      mediaContent = `<div class="post-icon-fallback">${fallbackIcon}</div>`;
    }

    // 3. 组装卡片内容 (注意这里引入了 mediaContent)
    card.innerHTML = `
      ${mediaContent}
      <div class="post-card-info">
        <h3>${post.title}</h3>
        <p>${timeAgo} · ${post.location}</p>
      </div>
    `;

    card.addEventListener("click", () => {
      window.location.href = `detail.html?id=${post.id}`;
    });

    postList.appendChild(card);
  });
}

// 处理顶部筛选按钮
function setupFilters() {
  const buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(item =>
        item.classList.remove("active")
      );

      button.classList.add("active");
      currentType = button.dataset.type;
      renderPosts(currentType);
    });
  });
}

// 页面初始化
document.addEventListener("DOMContentLoaded", () => {
  initPosts();
  renderPosts();
  setupFilters();
});