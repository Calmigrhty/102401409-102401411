document.addEventListener("DOMContentLoaded", () => {
  renderMyPosts();
});

function renderMyPosts() {
  const postList = document.getElementById("my-posts-list");
  const posts = getPosts(); 

  // 筛选出属于当前用户的帖子 (在 publish.js 中我们写死了 publisher 为 "我自己")
  let myPosts = posts.filter(post => post.publisher === "我自己");

  // 为了能够在结对演示时直接看到图里的效果，如果没有真实数据，塞入两条 Mock 数据
  if (myPosts.length === 0) {
    myPosts = [
      { id: "mock-1", title: "灰色北面双肩包", publishTime: "2026-09-26T10:00:00", image: "", status: "resolved" },
      { id: "mock-2", title: "蓝色 Yeti 麦克风", publishTime: "2026-09-18T10:00:00", image: "", status: "active" }
    ];
  }

  // 动态更新顶部的数字统计
  const publishedCount = myPosts.length;
  document.getElementById("stat-published").textContent = publishedCount;
  
  // 【修改这里】动态计算已解决的数量，而不是写死 12
  const resolvedCount = myPosts.filter(post => post.status === "resolved").length + 12;
  document.getElementById("stat-resolved").textContent = resolvedCount;

  postList.innerHTML = "";

  myPosts.forEach(post => {
    const card = document.createElement("div");
    card.className = "list-card";
    
    // 1. 解析时间为 "2026年9月26日" 格式
    const d = new Date(post.publishTime);
    const dateStr = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;

    // 2. 引入类别与 Emoji 的映射字典
    const icons = {
      "数码电子": "🎧",
      "日常用品": "🧴",
      "卡片证件": "💳",
      "交通工具": "🚲",
      "其他": "📦"
    };
    // 如果碰巧遇到了没有存类别的脏数据，默认给个纸箱子
    const fallbackIcon = icons[post.category] || "📦";

    // 3. 动态判断：有图渲染图，没图渲染 Emoji
    let mediaContent = "";
    if (post.image && post.image.trim() !== "") {
      mediaContent = `<img src="${post.image}" class="list-card-img" onerror="this.outerHTML='<div class=\\'list-icon-fallback\\'>${fallbackIcon}</div>'">`;
    } else {
      mediaContent = `<div class="list-icon-fallback">${fallbackIcon}</div>`;
    }

    // 4. 判断状态渲染不同按钮
    const isResolved = post.status === "resolved";
    const btnClass = isResolved ? "status-btn resolved" : "status-btn";
    const btnText = isResolved ? "已解决" : "标记为已解决";

    // 5. 组装最终的 HTML 结构 (将 mediaContent 拼进去)
    card.innerHTML = `
      ${mediaContent}
      <div class="list-card-content">
        <h4>${post.title}</h4>
        <p>发布于 ${dateStr}</p>
        <button class="${btnClass}">${btnText}</button>
      </div>
    `;

    // 交互 1：点击整张卡片，跳转详情页
    card.addEventListener("click", () => {
      window.location.href = `detail.html?id=${post.id}`;
    });

    // 交互 2：点击【标记为已解决】按钮
    const statusBtn = card.querySelector(".status-btn");
    statusBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // 阻止冒泡
      if (isResolved) return; 
      if(confirm("确定要将该物品标记为已解决吗？")) {
        markAsResolved(post.id);
      }
    });

    postList.appendChild(card);
  });
}

// 核心业务：修改状态并保存回本地数据库
function markAsResolved(id) {
  const posts = getPosts();
  const targetPost = posts.find(p => p.id === id);
  if (targetPost) {
    targetPost.status = "resolved"; // 修改状态
    savePosts(posts); // 存回 localStorage
    renderMyPosts(); // 重新渲染页面刷新 UI
  }
}