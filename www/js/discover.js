let currentCategory = "all";

// 借用首页的时间计算函数
function getTimeAgo(timeStr) {
  const publishTime = new Date(timeStr).getTime();
  const now = new Date("2026-10-08T15:40:00").getTime(); 
  const diffHours = Math.floor((now - publishTime) / (1000 * 60 * 60));
  if (diffHours < 1) return "刚刚";
  if (diffHours < 24) return `${diffHours}小时前`;
  return `${Math.floor(diffHours / 24)}天前`;
}

function renderDiscoverPosts(category = "all", searchQuery = "") {
  const postList = document.getElementById("discover-post-list");
  const posts = getPosts(); // 从 storage 获取

  // 筛选逻辑：类别筛选 + 搜索词筛选
  const filteredPosts = posts.filter(post => {
    const matchCategory = category === "all" || post.category === category;
    const matchSearch = searchQuery === "" || post.title.includes(searchQuery) || post.description.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  postList.innerHTML = "";

  if (filteredPosts.length === 0) {
    postList.innerHTML = `<p class="empty-tip" style="grid-column: 1 / -1; text-align: center; color: #999; padding: 40px 0;">未找到相关物品</p>`;
    return;
  }

  filteredPosts.forEach(post => {
    const card = document.createElement("div");
    card.className = "post-card";
    const timeAgo = getTimeAgo(post.publishTime);

    // 判断是招领还是寻物，渲染不同颜色的标签
    const typeLabel = post.type === "found" ? "招领" : "寻物";
    const typeClass = post.type === "found" ? "" : "lost";
    
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
      <div class="post-card-tags">
        <span class="tag-type ${typeClass}">${typeLabel}</span>
        <span class="tag-category">${post.category}</span>
      </div>
      <div class="discover-card-info">
        <h3>${post.title}</h3>
        <p>${post.location}</p>
        <p>${timeAgo}</p>
      </div>
    `;

    card.addEventListener("click", () => {
      window.location.href = `detail.html?id=${post.id}`;
    });

    postList.appendChild(card);
  });
}

function setupDiscoverFilters() {
  const buttons = document.querySelectorAll("#discover-filters .filter-btn");
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      currentCategory = button.dataset.category;
      
      // 保留当前的搜索词一起筛选
      const currentSearch = document.getElementById("search-input").value.trim();
      renderDiscoverPosts(currentCategory, currentSearch);
    });
  });
}

function setupSearch() {
  const searchInput = document.getElementById("search-input");
  const clearBtn = document.getElementById("clear-search");

  // 监听输入，实时搜索
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    renderDiscoverPosts(currentCategory, query);
  });

  // 清空按钮
  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    renderDiscoverPosts(currentCategory, "");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initPosts();
  renderDiscoverPosts();
  setupDiscoverFilters();
  setupSearch();
});