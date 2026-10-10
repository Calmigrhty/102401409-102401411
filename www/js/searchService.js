function filterPosts(posts, category = "all", searchQuery = "") {
  const safePosts = Array.isArray(posts) ? posts : [];
  const keyword = String(searchQuery || "").trim().toLowerCase();

  return safePosts.filter(post => {
    // 已解决的信息不再出现在发现页
    const isActive = post.status === "active";

    // 类别筛选
    const matchCategory =
      category === "all" || post.category === category;

    // 空关键词表示不限制搜索；
    // 非空时匹配标题、描述、地点和类别
    const searchableFields = [
      post.title,
      post.description,
      post.location,
      post.category
    ];

    const matchSearch =
      keyword === "" ||
      searchableFields.some(value =>
        String(value || "").toLowerCase().includes(keyword)
      );

    return isActive && matchCategory && matchSearch;
  });
}

// 浏览器中直接使用 filterPosts()
// Node.js 单元测试通过 module.exports 引入
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    filterPosts
  };
}