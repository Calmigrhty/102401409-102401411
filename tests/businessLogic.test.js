const test = require("node:test");
const assert = require("node:assert/strict");

const {
  validatePostInput
} = require("../www/js/validation.js");

const {
  findSimilarPost,
  getResolvedStatusText
} = require("../www/js/postService.js");

test("T07：标题为空时发布校验失败", () => {
  const result = validatePostInput("", "wx123");

  assert.equal(result.valid, false);
  assert.equal(result.message, "请填写物品名称");
});

test("T08：联系方式为空时发布校验失败", () => {
  const result = validatePostInput("黑色雨伞", "");

  assert.equal(result.valid, false);
  assert.equal(result.message, "请填写联系方式");
});

test("T09：标题和联系方式均合法时校验成功", () => {
  const result = validatePostInput("黑色雨伞", "wx123");

  assert.equal(result.valid, true);
  assert.equal(result.message, "");
});

test("T10：可以找到相反类型、同类别且标题相似的活动帖子", () => {
  const posts = [
    {
      id: "1",
      type: "found",
      category: "数码电子",
      title: "AirPods Max银色",
      status: "active"
    },
    {
      id: "2",
      type: "found",
      category: "日常用品",
      title: "保温杯",
      status: "active"
    }
  ];

  const result = findSimilarPost(
    posts,
    "lost",
    "数码电子",
    "AirPods Max银色"
  );

  assert.ok(result);
  assert.equal(result.id, "1");
});

test("T11：已解决帖子不参与相似信息匹配", () => {
  const posts = [
    {
      id: "1",
      type: "found",
      category: "数码电子",
      title: "AirPods Max银色",
      status: "resolved"
    }
  ];

  const result = findSimilarPost(
    posts,
    "lost",
    "数码电子",
    "AirPods Max银色"
  );

  assert.equal(result, null);
});

test("T12：不同类型 resolved 状态显示正确", () => {
  assert.equal(getResolvedStatusText("lost"), "已找到");
  assert.equal(getResolvedStatusText("found"), "已归还");
});
