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

    card.innerHTML = `
      <div class="post-card-info">
        <h3>${post.title}</h3>
        <p>${timeAgo} · ${post.location}</p>
      </div>
    `;
    card.prepend(createPostImage(post, "post-card-img"));

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