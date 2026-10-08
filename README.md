# 校园失物招领 APP

2026秋软件工程第二次结对作业之程序实现。

## 项目成员

- 陈宝荣：102401409
- 陈博淇：102401411

## 项目简介

本项目基于第一次结对作业完成的校园失物招领原型进行实现。

主要实现以下业务流程：

发布信息 → 浏览或搜索 → 查看详情 → 获取联系方式 → 更新物品状态

## 技术方案

- HTML
- CSS
- JavaScript
- LocalStorage
- Capacitor
- Android

## 当前状态

项目初始化中。

## 开发约定

为了便于两人协作开发，项目统一使用以下数据结构和开发约定。

### 1. 帖子数据结构

每条失物招领信息统一使用以下结构：

```javascript
{
  id: "post-001",
  type: "found",
  category: "数码电子",
  title: "AirPods Max银色",
  location: "主图书馆四楼自习室",
  description: "物品详细描述",
  contactType: "微信",
  contact: "student_a",
  publisher: "同学A",
  publishTime: "2026-10-07 13:45",
  status: "active",
  image: "assets/images/airpods.jpg"
}
```

### 2. 类型约定

`type` 表示帖子类型：

- `lost`：寻物信息
- `found`：招领信息

程序内部统一使用英文值，不直接使用“寻物”“招领”作为数据值。

### 3. 状态约定

`status` 表示当前处理状态：

- `active`：信息仍然有效
- `resolved`：信息已经解决

页面显示规则：

- `lost + active`：寻找中
- `lost + resolved`：已找到
- `found + active`：招领中
- `found + resolved`：已归还

### 4. 物品类别

项目统一使用以下类别：

- 数码电子
- 日常用品
- 卡片证件
- 交通工具
- 其他

### 5. 本地数据存储

项目目前使用浏览器 `localStorage` 保存帖子数据。

统一存储键为：

```javascript
lostFoundPosts
```

公共数据操作统一通过 `www/js/storage.js` 中的方法完成：

```javascript
initPosts()
getPosts()
savePosts(posts)
getPostById(id)
```

业务页面尽量不要直接重复操作 `localStorage`，统一通过公共方法读取和保存数据。

### 6. 页面传参

进入物品详情页时，统一通过 URL 参数传递帖子 ID，例如：

```text
detail.html?id=post-001
```

详情页根据 `id` 获取对应帖子数据。

### 7. Git 提交规范

提交信息统一采用以下前缀：

- `feat:` 新增功能
- `fix:` 修复问题
- `style:` 页面样式调整
- `test:` 测试相关
- `docs:` 文档修改
- `chore:` 项目配置、依赖等维护工作

每完成一个相对独立且能够正常运行的功能后，再进行一次提交。