const CATEGORY_DEFAULT_IMAGES = Object.freeze({
  "数码电子": "assets/images/defaults/default-digital.png",
  "日常用品": "assets/images/defaults/default-daily.png",
  "卡片证件": "assets/images/defaults/default-card.png",
  "交通工具": "assets/images/defaults/default-transport.png",
  "其他": "assets/images/defaults/default-other.png"
});

function getCategoryDefaultImage(category) {
  return Object.prototype.hasOwnProperty.call(CATEGORY_DEFAULT_IMAGES, category)
    ? CATEGORY_DEFAULT_IMAGES[category]
    : CATEGORY_DEFAULT_IMAGES["其他"];
}

function getPostDisplayImage(post) {
  if (typeof post?.image === "string" && post.image.trim() !== "") {
    return post.image;
  }

  return getCategoryDefaultImage(post?.category);
}

function handlePostImageError(image, category) {
  image.onerror = null;
  image.src = getCategoryDefaultImage(category);
}

function createPostImage(post, className = "") {
  const image = document.createElement("img");
  image.src = getPostDisplayImage(post);
  image.alt = post.title || "";
  image.className = className;
  image.onerror = () => handlePostImageError(image, post.category);
  return image;
}
