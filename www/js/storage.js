const STORAGE_KEY = "lostFoundPosts";

// 初始化帖子数据
function initPosts() {
  const posts = localStorage.getItem(STORAGE_KEY);

  if (!posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
  }
}

// 获取全部帖子
function getPosts() {
  initPosts();

  const posts = localStorage.getItem(STORAGE_KEY);

  return JSON.parse(posts);
}

// 保存全部帖子
function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

// 根据 id 获取帖子
function getPostById(id) {
  const posts = getPosts();

  return posts.find(post => post.id === id);
}