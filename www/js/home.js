let currentType = "all";

// 根据类别返回一个临时图标
function getCategoryIcon(category) {
  const icons = {
    "数码电子": "🎧",
    "日常用品": "🧴",
    "卡片证件": "💳",
    "交通工具": "🚲",
    "其他": "📦"
  };

  return icons[category] || "📦";
}

// 将帖子显示到首页
function renderPosts(type = "all") {
  const postList = document.getElementById("post-list");
  const posts = getPosts();

  const filteredPosts =
    type === "all"
      ? posts
      : posts.filter(post => post.type === type);

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

    const typeText =
      post.type === "lost" ? "寻物" : "招领";

    card.innerHTML = `
      <div class="post-icon">
        ${getCategoryIcon(post.category)}
      </div>

      <span class="post-type">
        ${typeText}
      </span>

      <h3>${post.title}</h3>

      <p>${post.location}</p>
      <p>${post.category}</p>
    `;

    card.addEventListener("click", () => {
      window.location.href =
        `detail.html?id=${post.id}`;
    });

    postList.appendChild(card);
  });
}

// 处理顶部筛选按钮
function setupFilters() {
  const buttons =
    document.querySelectorAll(".filter-btn");

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