document.addEventListener("DOMContentLoaded", () => {
  renderMyPosts();
});

function renderMyPosts() {
  const postList = document.getElementById("my-posts-list");
  const posts = getPosts();

  // 筛选出属于当前用户的帖子 (在 publish.js 中我们写死了 publisher 为 "我自己")
  const myPosts = posts.filter(post => post.publisher === "我自己");

  // 动态更新顶部的数字统计
  const publishedCount = myPosts.length;
  document.getElementById("stat-published").textContent = publishedCount;
  
  // 【修改这里】动态计算已解决的数量，而不是写死 12
  const resolvedCount = myPosts.filter(post => post.status === "resolved").length;
  document.getElementById("stat-resolved").textContent = resolvedCount;

  postList.innerHTML = "";

  if (myPosts.length === 0) {
    postList.innerHTML = `
      <div class="empty-tip">暂无发布记录</div>
    `;
    return;
  }

  myPosts.forEach(post => {
    const card = document.createElement("div");
    card.className = "list-card";
    
    // 1. 解析时间为 "2026年9月26日" 格式
    const d = new Date(post.publishTime);
    const dateStr = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;

    // 2. 判断状态渲染不同按钮
    const isResolved = post.status === "resolved";
    const btnClass = isResolved ? "status-btn resolved" : "status-btn";
    const btnText = isResolved
      ? getResolvedStatusText(post.type)
      : (post.type === "lost"
          ? "标记为已找到"
          : "标记为已归还");

    card.innerHTML = `
      <div class="list-card-content">
        <h4>${post.title}</h4>
        <p>发布于 ${dateStr}</p>
        <div class="list-card-actions">
          <button class="${btnClass}">${btnText}</button>
          <button class="edit-post-btn">编辑</button>
          <button class="delete-post-btn">删除</button>
        </div>
      </div>
    `;
    card.prepend(createPostImage(post, "list-card-img"));

    // 交互 1：点击整张卡片，跳转详情页
    card.addEventListener("click", () => {
      window.location.href = `detail.html?id=${post.id}`;
    });

    // 交互 2：点击状态更新按钮
    const statusBtn = card.querySelector(".status-btn");
    statusBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // 阻止冒泡
      togglePostStatus(post.id);
    });

    card.querySelector(".edit-post-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      window.location.href = `publish.html?edit=${encodeURIComponent(post.id)}`;
    });

    card.querySelector(".delete-post-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm("确定要删除这条发布信息吗？删除后无法恢复。")) {
        if (!deletePost(post.id)) {
          alert("该物品不存在或已被删除");
        }
        renderMyPosts();
      }
    });

    postList.appendChild(card);
  });
}

// 在 active 与 resolved 之间切换状态并保存
function togglePostStatus(id) {
  const posts = getPosts();
  const targetPost = posts.find(p => p.id === id);
  if (!targetPost) {
    return;
  }

  const isResolved = targetPost.status === "resolved";
  if (isResolved) {
    const confirmText = targetPost.type === "lost"
      ? "确定要恢复为寻找中吗？"
      : "确定要恢复为招领中吗？";

    if (!confirm(confirmText)) {
      return;
    }
  }

  targetPost.status = isResolved ? "active" : "resolved";
  savePosts(posts);
  renderMyPosts();
}