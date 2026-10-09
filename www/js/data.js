// 校园失物招领初始帖子数据
// 后续首次启动应用时，会将这些数据写入 localStorage。

const INITIAL_POSTS = [
  {
    id: "post-001",
    type: "found",
    category: "数码电子",
    title: "AirPods Max银色",
    location: "主图书馆四楼自习室",
    description:
      "下午1:40左右在402B自习室靠窗的桌子上发现。耳机是银色的，带有白色耳机套，右侧耳罩边缘有轻微划痕。",
    contactType: "微信",
    contact: "student_a",
    publisher: "同学A",
    publishTime: "2026-10-07 13:45",
    status: "active",
    image: "assets/images/airpods.jpg"
  },

  {
    id: "post-002",
    type: "lost",
    category: "日常用品",
    title: "军绿色保温杯",
    location: "体育馆二层看台",
    description:
      "军绿色保温杯，杯盖有一圈黑色防滑胶。上午体育课后发现遗失，如有拾到请联系我核对杯底贴纸。",
    contactType: "微信",
    contact: "student_a",
    publisher: "同学A",
    publishTime: "2026-10-07 10:20",
    status: "active",
    image: "assets/images/bottle.jpg"
  },

  {
    id: "post-003",
    type: "found",
    category: "日常用品",
    title: "皮革挂绳钥匙扣",
    location: "西区操场看台",
    description:
      "在西区操场看台座位下发现，棕色皮革挂绳，带两把钥匙。请描述钥匙特征后认领。",
    contactType: "QQ",
    contact: "123456789",
    publisher: "同学A",
    publishTime: "2026-10-07 15:10",
    status: "active",
    image: "assets/images/keychain.jpg"
  },

  {
    id: "post-004",
    type: "lost",
    category: "数码电子",
    title: "TI-84 Plus计算器",
    location: "文科楼2-204",
    description:
      "黑色TI-84 Plus计算器，背面贴有姓名缩写。上课后遗失，请拾到的同学联系我。",
    contactType: "手机",
    contact: "13800000000",
    publisher: "同学A",
    publishTime: "2026-10-07 11:05",
    status: "active",
    image: "assets/images/calculator.jpg"
  },

  {
    id: "post-005",
    type: "found",
    category: "卡片证件",
    title: "校园一卡通（张*）",
    location: "第二教学楼102室",
    description:
      "课桌抽屉内发现一张校园一卡通，姓名为张同学。为保护隐私，领取时请出示学生证核验。",
    contactType: "微信",
    contact: "student_a",
    publisher: "同学A",
    publishTime: "2026-10-07 12:30",
    status: "active",
    image: "assets/images/campus-card.jpg"
  },

  {
    id: "post-006",
    type: "lost",
    category: "其他",
    title: "灰色北面双肩包",
    location: "西区教学楼",
    description:
      "灰色北面双肩包，包内有教材和一些个人用品。遗失后一直没有找到，如有拾到请联系我核对包内物品。",
    contactType: "微信",
    contact: "user_me",
    publisher: "我自己",
    publishTime: "2026-09-26 10:00",
    status: "resolved",
    image: ""
  },

  {
    id: "post-007",
    type: "lost",
    category: "数码电子",
    title: "蓝色 Yeti 麦克风",
    location: "计算机实验室",
    description:
      "蓝色 Yeti USB 麦克风，底座有轻微划痕，在实验室使用后遗失。",
    contactType: "微信",
    contact: "user_me",
    publisher: "我自己",
    publishTime: "2026-09-18 10:00",
    status: "active",
    image: ""
  }
];