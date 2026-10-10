function findSimilarPost(posts, type, category, title) {
  const safePosts = Array.isArray(posts) ? posts : [];
  const normalizedTitle = String(title || "").trim();

  const targetType = type === "lost" ? "found" : "lost";

  return safePosts.find(post =>
    post.status === "active" &&
    post.type === targetType &&
    post.category === category &&
    (
      String(post.title || "").includes(normalizedTitle) ||
      normalizedTitle.includes(String(post.title || ""))
    )
  ) || null;
}

function getResolvedStatusText(type) {
  return type === "lost" ? "已找到" : "已归还";
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    findSimilarPost,
    getResolvedStatusText
  };
}