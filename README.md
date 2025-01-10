# 南雍寻迹（NJU_MAP）

## 项目简介

南雍寻迹是一款为南京大学鼓楼校区的校园导览程序，为来到南大参观的游客提供指引和景点介绍

项目现已开源：[前端Github仓库地址]([white-bear233/NJU_Map](https://github.com/white-bear233/NJU_Map))

------

## 项目功能

- **建筑信息管理**：提供详细的校园建筑信息，包括图片和文字描述。
- **路线规划**：支持用户根据兴趣点生成校园参观路线。
- **我的足迹**：记录用户的参观历史。
- **拍照**：直接进行拍照保存
- **智能识别位置**：智能识别位置，推送景点信息

------

## 技术栈

- **前端开发工具**：微信开发者工具

------

## 项目结构

```
├─components #复用组件
│  ├─navigation-bar
│  ├─RouteDetail
│  └─SpotDetail
├─custom-tab-bar
├─libs
├─miniprogram_npm
├─node_modules
└─pages # 小程序页面
    ├─camera
    ├─footprint
    ├─getInfo
    ├─index
    ├─pictureWall
    ├─RouteDetail
    ├─start
    ├─takePhoto
    └─userCenter
```

------

## **安装与运行**

### **1. 克隆项目**

```
git clone https://github.com/white-bear233/NJU_Map.git #小程序前端
```

### **2. 配置环境**

- 前端使用npm 构建依赖

  ```bash
  npm install
  ```

### **3. 启动项目**

- 前端可以直接预览或者使用真机调试

## 版本历史

v1.0.0 (2024 -12-1)

## 项目演示视频

[南京大学软件学院人机交互作品展示场景视频](https://www.bilibili.com/video/BV1TbCNYrEUu/?share_source=copy_web&vd_source=4d507a9f9372c3b3ebf3ac7da9f1fa50)

