const test = require("node:test");
const assert = require("node:assert/strict");

const {
  filterPosts
} = require("../www/js/searchService.js");

const posts = [
  {
    id: "1",
    type: "found",
    category: "数码电子",
    title: "AirPods Max银色",
    description: "在图书馆四楼发现一副耳机",
    location: "主图书馆",
    status: "active"
  },
  {
    id: "2",
    type: "lost",
    category: "日常用品",
    title: "军绿色保温杯",
    description: "杯盖有一圈黑色防滑胶",
    location: "体育馆",
    status: "active"
  },
  {
    id: "3",
    type: "lost",
    category: "数码电子",
    title: "蓝色麦克风",
    description: "USB 麦克风",
    location: "计算机实验室",
    status: "resolved"
  },
  {
    id: "4",
    type: "found",
    category: "卡片证件",
    title: "校园一卡通",
    description: "姓名为张同学",
    location: "第二教学楼",
    status: "active"
  }
];

test("T01：根据标题关键词搜索帖子", () => {
  const result = filterPosts(posts, "all", "AirPods");

  assert.equal(result.length, 1);
  assert.equal(result[0].id, "1");
});

test("T02：可以根据描述中的关键词搜索", () => {
  const result = filterPosts(posts, "all", "防滑胶");

  assert.equal(result.length, 1);
  assert.equal(result[0].id, "2");
});

test("T03：不存在的关键词返回空数组", () => {
  const result = filterPosts(posts, "all", "完全不存在的物品");

  assert.equal(result.length, 0);
});

test("T04：可以按类别筛选", () => {
  const result = filterPosts(posts, "卡片证件", "");

  assert.equal(result.length, 1);
  assert.equal(result[0].id, "4");
});

test("T05：resolved 帖子不会出现在结果中", () => {
  const result = filterPosts(posts, "数码电子", "");

  assert.equal(result.length, 1);
  assert.equal(result[0].id, "1");
});

test("T06：类别和搜索关键词可以组合筛选", () => {
  const result = filterPosts(posts, "日常用品", "保温杯");

  assert.equal(result.length, 1);
  assert.equal(result[0].id, "2");
});
