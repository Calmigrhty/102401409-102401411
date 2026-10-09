document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const isEditMode = params.has("edit");
  const editId = params.get("edit");
  const editPost = isEditMode && editId ? getPostById(editId) : null;

  if (isEditMode && (!editId || !editPost || editPost.publisher !== "我自己")) {
    alert("无法编辑该发布信息");
    window.location.href = "profile.html";
    return;
  }

  let uploadedImageBase64 = editPost?.image || "";

  if (editPost) {
    document.querySelector("header h1").textContent = "编辑信息";
    document.getElementById("submit-btn").textContent = "保存修改";
    document.querySelector('input[placeholder="填写物品名称"]').value = editPost.title;
    document.querySelector('input[placeholder="填写地点"]').value = editPost.location;
    document.querySelector("textarea").value = editPost.description;
    document.getElementById("contact-type").value = editPost.contactType;
    document.getElementById("contact-input").value = editPost.contact;

    document.querySelectorAll(".type-btn").forEach(button => {
      button.classList.toggle("active", button.dataset.type === editPost.type);
    });
    document.querySelectorAll(".cat-btn").forEach(button => {
      button.classList.toggle("active", button.dataset.category === editPost.category);
    });

    if (editPost.image) {
      document.getElementById("upload-text").style.display = "none";
      const imagePreview = document.getElementById("image-preview");
      imagePreview.src = editPost.image;
      imagePreview.style.display = "block";
      document.getElementById("upload-box").style.border = "none";
    }
  }

  // 1. 处理选项按钮的激活切换
  const setupToggle = (selector) => {
    const buttons = document.querySelectorAll(selector);
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  };

  setupToggle(".type-btn");
  setupToggle(".cat-btn");

  // 2. 获取节点
  const submitBtn = document.getElementById("submit-btn");
  const dupModal = document.getElementById("duplicate-modal");
  const successModal = document.getElementById("success-modal");
  
  const goDetailBtn = document.getElementById("go-detail-btn");
  const continuePublishBtn = document.getElementById("continue-publish-btn");
  
  const backHomeBtn = document.getElementById("back-home-btn");
  const viewProfileBtn = document.getElementById("view-profile-btn");

  // 3. 点击【确认发布】，弹出防重匹配弹窗
  submitBtn.addEventListener("click", () => {
    const titleInput = document.querySelector('input[placeholder="填写物品名称"]').value.trim();
    const categoryInput = document.querySelector('.cat-btn.active').dataset.category;
    const typeInput = document.querySelector('.type-btn.active').dataset.type;
    const contactInput = document.getElementById("contact-input").value.trim();

    if (!titleInput) {
      alert("请填写物品名称");
      return;
    }

    if (!contactInput) {
      alert("请填写联系方式");
      return;
    }

    if (editPost) {
      const updated = updatePost(editPost.id, {
        type: typeInput,
        category: categoryInput,
        title: titleInput,
        location: document.querySelector('input[placeholder="填写地点"]').value,
        description: document.querySelector("textarea").value,
        contactType: document.getElementById("contact-type").value,
        contact: contactInput,
        image: uploadedImageBase64
      });

      if (!updated) {
        alert("该物品不存在或已被删除");
        window.location.href = "profile.html";
        return;
      }

      successModal.querySelector("h2").textContent = "修改成功！";
      successModal.querySelector(".modal-desc").textContent =
        "修改已保存，可在首页和“我的发布”中查看。";
      successModal.classList.remove("hidden");
      return;
    }

    // 调用 storage.js 获取所有历史数据
    const posts = getPosts();

    // 算法逻辑：寻找相反类型（比如我发布丢失，系统就去查招领），且标题或类别命中的物品
    const targetType = typeInput === "lost" ? "found" : "lost";
    const similarPost = posts.find(post => 
      post.type === targetType && post.category === categoryInput && 
      (post.title.includes(titleInput) || titleInput.includes(post.title))
    );

    if (similarPost) {
      // 找到了！动态替换弹窗里面的静态 HTML 结构
      const dupCard = document.querySelector('.duplicate-card');
      const tagText = similarPost.type === "found" ? "招领中" : "寻物中";
      
      // 容错处理图片：有图渲染原图，没图渲染 emoji 占位符
      const imgHtml = similarPost.image 
        ? `<img src="${similarPost.image}" alt="${similarPost.title}">`
        : `<div style="width:70px;height:70px;background:#f0f1f3;display:flex;align-items:center;justify-content:center;border-radius:8px;font-size:32px;">📦</div>`;

      dupCard.innerHTML = `
        ${imgHtml}
        <div class="duplicate-info">
          <span class="tag-type">${tagText}</span>
          <h3>${similarPost.title}</h3>
          <p>地点：${similarPost.location}</p>
        </div>
      `;

      // 把找到的物品真实 ID 绑在“去核对详情”按钮的 data 属性上
      goDetailBtn.dataset.targetId = similarPost.id;
      
      dupModal.classList.remove("hidden");
    } else {
      // 没找到相似物品，直接触发“继续发布”的保存并成功流程
      continuePublishBtn.click();
    }
  });

  // 4. 在防重弹窗点击【是的，去核对详情】
  goDetailBtn.addEventListener("click", (e) => {
    // 读取刚才动态绑定的 ID 并跳转，如果没有读取到则兜底跳转 post-001
    const targetId = e.target.dataset.targetId || "post-001";
    window.location.href = `detail.html?id=${targetId}`;
  });

  // 5. 在防重弹窗点击【不是我的，继续发布】，关闭当前弹窗，弹出成功弹窗
  continuePublishBtn.addEventListener("click", () => {
    dupModal.classList.add("hidden");
    
    // 1. 抓取页面上填写的真实数据
    // 注意：如果在 html 里没加类名或 id，可以用 placeholder 属性来精准定位抓取
    const title = document.querySelector('input[placeholder="填写物品名称"]').value;
    const location = document.querySelector('input[placeholder="填写地点"]').value;
    const description = document.querySelector('textarea').value;
    const contactType = document.getElementById("contact-type").value;
    const contact = document.getElementById("contact-input").value.trim();

    // 2. 组装成一个新的物品对象
    const newPost = {
      id: "post-" + Date.now(),
      type: document.querySelector('.type-btn.active').dataset.type,
      category: document.querySelector('.cat-btn.active').dataset.category,
      title: title || "未命名物品",
      location: document.querySelector('input[placeholder="填写地点"]').value || "未知地点",
      description: document.querySelector('textarea').value || "无详细描述",
      contactType: contactType,
      contact: contact,
      publisher: "我自己",
      publishTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: "active",
      
      // 把刚才存好的 Base64 图片数据赋给 image 字段
      image: uploadedImageBase64 
    };

    // 3. 调用 storage.js 的方法保存到浏览器本地
    const posts = getPosts();
    posts.unshift(newPost); // unshift 可以把新数据插到数组的最前面
    savePosts(posts);

    // 4. 弹出成功弹窗
    document.getElementById("duplicate-modal").classList.add("hidden");
    setTimeout(() => {
      document.getElementById("success-modal").classList.remove("hidden");
    }, 300);
  });

  // 6. 在成功弹窗点击【返回首页】
  backHomeBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // 7. 在成功弹窗点击【查看我的发布】
  viewProfileBtn.addEventListener("click", () => {
    window.location.href = "profile.html";
  });

  // ================= 1. 处理图片上传与预览 =================
  const uploadBox = document.getElementById("upload-box");
  const fileInput = document.getElementById("file-input");
  const uploadText = document.getElementById("upload-text");
  const imagePreview = document.getElementById("image-preview");

  // 1. 点击虚线框，拉起系统的文件选择器
  uploadBox.addEventListener("click", () => {
    fileInput.click();
  });

  // 2. 用户选好文件后的处理逻辑
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      // 使用 FileReader 把图片读成 Base64 编码，这样才能存进 localStorage
      const reader = new FileReader();
      reader.onload = function(event) {
        uploadedImageBase64 = event.target.result; 
        
        // 切换 UI 显示：藏起虚线和文字，显示真实的图片
        uploadText.style.display = "none";
        imagePreview.src = uploadedImageBase64;
        imagePreview.style.display = "block";
        uploadBox.style.border = "none"; // 有图了就把绿色虚线边框去掉
      };
      reader.readAsDataURL(file);
    }
  });
});