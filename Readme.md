# Web Image Extractor Chrome Extension

一个简单而强大的 Chrome 扩展，用于提取网页中的所有图片 URL。

## 功能特点

- 自动提取页面中所有图片
- 智能处理 srcset 属性，获取最高质量图片
- 自动过滤无效图片链接
- 去除重复图片
- 仅支持 http/https 协议的图片

## 安装说明

1. 下载或克隆此仓库到本地
2. 打开 Chrome 浏览器，进入扩展程序页面 (`chrome://extensions/`)
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目文件夹

## 使用方法

1. 安装扩展后，在浏览器右上角会出现扩展图标
2. 访问任意网页
3. 点击扩展图标即可获取当前页面的所有图片

## 技术实现

- 使用 Chrome Extension Manifest V3
- 通过 Content Script 实现页面图片提取
- 使用现代 JavaScript 特性优化性能
- 支持响应式图片的 srcset 属性处理

## 项目结构 