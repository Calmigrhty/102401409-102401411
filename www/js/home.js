let currentType = "all";

// 辅助函数：计算“几小时前/几天前” (让界面更有真实感)
// 因为 initial_posts 里的发布时间是 "2026-10-07 13:45" 这种格式
function getTimeAgo(timeStr) {
  const publishTime = new Date(timeStr).getTime();
  const now = new Date("2026-10-08T15:40:00").getTime(); // 为了配合设计图效果锁定当前时间基准，真实项目可直接用 new Date().getTime()
  const diffHours = Math.floor((now - publishTime) / (1000 * 60 * 60));
  
  if (diffHours < 1) return "刚刚";
  if (diffHours < 24) return `${diffHours}小时前`;
  return `${Math.floor(diffHours / 24)}天前`;
}

// 将帖子显示到首页
function renderPosts(type = "all") {
  const postList = document.getElementById("post-list");
  const posts = getPosts(); //[cite: 13, 12]

  const filteredPosts =
    type === "all"
      ? posts
      : posts.filter(post => post.type === type); //[cite: 12]

  postList.innerHTML = ""; //[cite: 12]

  if (filteredPosts.length === 0) {
    postList.innerHTML = `
      <p class="empty-tip">暂无相关信息</p>
    `; //[cite: 12]
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

// 处理顶部筛选按钮[cite: 12]
function setupFilters() {
  const buttons = document.querySelectorAll(".filter-btn"); //[cite: 12]

  buttons.forEach(button => { //[cite: 12]
    button.addEventListener("click", () => { //[cite: 12]
      buttons.forEach(item =>
        item.classList.remove("active") //[cite: 12]
      );

      button.classList.add("active"); //[cite: 12]
      currentType = button.dataset.type; //[cite: 12]
      renderPosts(currentType); //[cite: 12]
    });
  });
}

// 页面初始化[cite: 12]
document.addEventListener("DOMContentLoaded", () => { //[cite: 12]
  initPosts(); //[cite: 12]
  renderPosts(); //[cite: 12]
  setupFilters(); //[cite: 12]
});