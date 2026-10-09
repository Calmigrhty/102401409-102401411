const STORAGE_KEY = "lostFoundPosts";
const PROFILE_POSTS_MIGRATION_KEY = "profilePostsSeeded";

// 初始化帖子数据
function initPosts() {
  const posts = localStorage.getItem(STORAGE_KEY);

  if (!posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POSTS));
    localStorage.setItem(PROFILE_POSTS_MIGRATION_KEY, "true");
    return;
  }

  if (localStorage.getItem(PROFILE_POSTS_MIGRATION_KEY)) {
    return;
  }

  const savedPosts = JSON.parse(posts);
  const existingIds = new Set(savedPosts.map(post => post.id));
  const missingProfilePosts = INITIAL_POSTS.filter(
    post => post.publisher === "我自己" && !existingIds.has(post.id)
  );

  if (missingProfilePosts.length > 0) {
    savePosts([...savedPosts, ...missingProfilePosts]);
  }

  localStorage.setItem(PROFILE_POSTS_MIGRATION_KEY, "true");
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

function updatePost(id, updates) {
  const posts = getPosts();
  const postIndex = posts.findIndex(post => post.id === id);

  if (postIndex === -1) {
    return false;
  }

  const currentPost = posts[postIndex];
  posts[postIndex] = {
    ...currentPost,
    ...updates,
    id: currentPost.id,
    publisher: currentPost.publisher,
    publishTime: currentPost.publishTime,
    status: currentPost.status
  };
  savePosts(posts);
  return true;
}

function deletePost(id) {
  const posts = getPosts();
  const remainingPosts = posts.filter(post => post.id !== id);

  if (remainingPosts.length === posts.length) {
    return false;
  }

  savePosts(remainingPosts);
  return true;
}