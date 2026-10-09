let currentCategory = "all";

// 借用首页的时间计算函数
function getTimeAgo(timeStr) {
  const publishTime = new Date(timeStr).getTime();
  const diffMs = Math.max(0, Date.now() - publishTime);
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "刚刚";
  if (diffHours < 24) return `${diffHours}小时前`;
  return `${Math.floor(diffHours / 24)}天前`;
}

function renderDiscoverPosts(category = "all", searchQuery = "") {
  const postList = document.getElementById("discover-post-list");
  const posts = getPosts(); // 从 storage 获取

  // 筛选逻辑：类别筛选 + 搜索词筛选
  const filteredPosts = posts.filter(post => {
    const isActive = post.status === "active";
    const matchCategory = category === "all" || post.category === category;
    const matchSearch = searchQuery === "" || post.title.includes(searchQuery) || post.description.includes(searchQuery);
    return isActive && matchCategory && matchSearch;
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

    card.innerHTML = `
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
    card.prepend(createPostImage(post, "post-card-img"));

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