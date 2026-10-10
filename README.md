# 校园失物招领 APP

2026 秋软件工程第二次结对作业之程序实现。

## 一、项目成员

- 陈宝荣：102401409
- 陈博淇：102401411

GitHub 仓库：

`bookiii98/102401409-102401411`

---

## 二、项目简介

本项目基于第一次结对作业完成的校园失物招领原型进行程序实现，面向校园中失物和招领信息分散、查找不方便的问题。

项目主要业务流程为：

发布寻物/招领信息 → 浏览或搜索信息 → 查看详情 → 获取发布者联系方式 → 物品找回后更新状态

项目采用 HTML、CSS 和 JavaScript 实现页面和业务逻辑，并使用 Capacitor 封装为 Android APP。

数据目前保存在设备本地的 LocalStorage 中，不依赖服务器和数据库。

---

## 三、主要功能

目前已经实现以下功能：

- 发布寻物信息和招领信息
- 首页浏览当前有效信息
- 关键词搜索失物招领信息
- 按物品类别筛选
- 查看物品详情
- 查看并复制发布者联系方式
- 发布时上传物品图片
- 未上传图片时显示对应类别的默认封面
- 发布寻物信息时匹配可能对应的招领信息
- 发布招领信息时匹配可能对应的寻物信息
- 将寻物信息标记为“已找到”
- 将招领信息标记为“已归还”
- 恢复已经解决的信息
- 查看自己的发布记录
- 编辑自己的发布信息
- 删除自己的发布信息
- LocalStorage 本地持久化保存数据

其中分类筛选、一键复制联系方式、相似物品匹配等功能是在基本失物招领流程上的进一步完善。

---

## 四、Android APK

项目已使用 Capacitor 封装为 Android APP。

可安装 APK 位于：

```text
apk/campus-lost-found.apk
```

Android 手机下载该 APK 后即可安装运行。

如果系统提示禁止安装未知来源应用，需要允许当前浏览器或文件管理器安装未知来源应用后重新安装。

> APK 仅适用于 Android 设备，不能直接安装在 iOS 设备上。

---

## 五、项目目录

```text
102401409-102401411/
├── README.md
├── package.json
├── package-lock.json
├── capacitor.config.json
│
├── apk/
│   └── campus-lost-found.apk
│
├── android/
│   └── Android 原生工程
│
├── tests/
│   ├── businessLogic.test.js
│   └── searchService.test.js
│
└── www/
    ├── index.html
    ├── discover.html
    ├── publish.html
    ├── detail.html
    ├── profile.html
    │
    ├── css/
    │   ├── common.css
    │   ├── home.css
    │   ├── discover.css
    │   ├── publish.css
    │   ├── detail.css
    │   └── profile.css
    │
    ├── js/
    │   ├── data.js
    │   ├── storage.js
    │   ├── media.js
    │   ├── home.js
    │   ├── discover.js
    │   ├── publish.js
    │   ├── detail.js
    │   ├── profile.js
    │   ├── searchService.js
    │   ├── validation.js
    │   └── postService.js
    │
    └── assets/
        └── images/
```

主要目录说明：

- `www/`：应用的 Web 页面、样式、业务逻辑和资源文件
- `www/js/`：数据存储、搜索、发布、详情和状态管理等 JavaScript 代码
- `tests/`：自动化单元测试
- `android/`：Capacitor 生成的 Android 工程
- `apk/`：最终可安装的 Android APK
- `capacitor.config.json`：Capacitor 项目配置

---

## 六、使用说明

### 1. Android 手机直接运行

下载：

```text
apk/campus-lost-found.apk
```

在 Android 手机中安装并打开即可。

进入 APP 后可以通过底部导航栏使用主要功能：

- 首页：浏览当前有效的失物招领信息
- 发现：搜索并按类别筛选信息
- 发布：发布新的寻物或招领信息
- 我的：查看和管理自己发布的信息

点击信息卡片可以进入详情页面。

如果物品已经找回，可以在“我的发布”中将：

- 寻物信息标记为“已找到”
- 招领信息标记为“已归还”

---

### 2. 浏览器预览

项目页面位于：

```text
www/
```

可以使用浏览器打开：

```text
www/index.html
```

预览 Web 页面。

---

### 3. Android 工程运行

首先安装项目依赖：

```bash
npm install
```

同步 Web 资源到 Android 工程：

```bash
npx cap sync android
```

打开 Android Studio：

```bash
npx cap open android
```

随后可在 Android Studio 中选择模拟器或 Android 设备运行。

---

## 七、单元测试

项目使用 Node.js 内置测试框架 `node:test` 和 `node:assert` 完成自动化单元测试。

测试内容主要包括：

- 搜索关键词匹配
- 描述内容搜索
- 类别筛选
- 已解决帖子过滤
- 类别与关键词组合筛选
- 发布信息参数校验
- 相似失物招领信息匹配
- 已解决信息匹配过滤
- 状态文本处理

共设计 12 个自动化单元测试。

安装依赖后运行：

```bash
npm test
```

当前测试结果：

```text
tests 12
pass 12
fail 0
```

其中发布信息参数校验采用分支覆盖方法进行了白盒测试。

---

## 八、技术方案

项目主要使用：

- HTML
- CSS
- JavaScript
- LocalStorage
- Node.js
- Capacitor
- Android

页面和主要业务逻辑位于 `www/` 中。

Capacitor 用于将 Web 应用封装为 Android APP。

LocalStorage 用于保存失物招领帖子，因此当前数据保存在本地设备中，不同设备之间不会自动同步。

---

## 九、数据结构

每条失物招领信息主要使用以下结构：

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

### 类型

`type`：

- `lost`：寻物信息
- `found`：招领信息

### 状态

`status`：

- `active`：当前信息仍然有效
- `resolved`：物品已经找到或归还

页面对应关系：

- `lost + active`：寻找中
- `lost + resolved`：已找到
- `found + active`：招领中
- `found + resolved`：已归还

### 物品类别

项目统一使用：

- 数码电子
- 日常用品
- 卡片证件
- 交通工具
- 其他

---

## 十、本地数据存储

项目使用浏览器 LocalStorage 保存帖子数据。

存储键：

```text
lostFoundPosts
```

相关数据操作主要封装在：

```text
www/js/storage.js
```

包括：

```javascript
initPosts()
getPosts()
savePosts(posts)
getPostById(id)
updatePost(id, updates)
deletePost(id)
```

当前版本没有使用服务器数据库，因此不同设备之间的数据不会同步。

---

## 十一、Git 提交规范

项目开发过程中主要采用以下提交前缀：

- `feat:` 新增功能
- `fix:` 修复问题
- `style:` 页面样式调整
- `test:` 测试相关
- `docs:` 文档修改
- `refactor:` 代码重构
- `chore:` 项目配置和依赖维护

每完成一个相对独立且能够正常运行的功能后进行一次提交。