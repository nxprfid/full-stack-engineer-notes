import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

// 自动生成侧边栏的函数
function getSidebar() {
  const root = path.resolve(__dirname, '..')
  const ignoreDirs = ['.vitepress', '.git', 'node_modules', '.vscode', 'public', '.github']
  const ignoreFiles = ['README.md', 'index.md']
  
  const sidebar = []
  
  try {
    const dirs = fs.readdirSync(root, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && !ignoreDirs.includes(dirent.name) && !dirent.name.startsWith('.'))
      .map(dirent => dirent.name)
      
    for (const dir of dirs) {
      const dirPath = path.join(root, dir)
      const files = getFiles(dirPath, dir)
      if (files.length > 0) {
        sidebar.push({
          text: dir.replace('_note', ''),
          collapsed: true,
          items: files
        })
      }
    }
  } catch (e) {
    console.error('Error generating sidebar:', e)
  }
  
  return sidebar
}

function getFiles(dirPath: string, basePath: string) {
  const items: any[] = []
  try {
    const files = fs.readdirSync(dirPath, { withFileTypes: true })
    
    for (const file of files) {
      if (file.isDirectory() && !file.name.startsWith('.')) {
        const subItems = getFiles(path.join(dirPath, file.name), `${basePath}/${file.name}`)
        if (subItems.length > 0) {
          items.push({
            text: file.name,
            collapsed: true,
            items: subItems
          })
        }
      } else if (file.isFile() && file.name.endsWith('.md')) {
        const name = file.name.replace('.md', '')
        // 对路径中的特殊字符进行编码，但VitePress可能需要原生字符串，我们先试试原生
        items.push({
          text: name,
          link: `/${basePath}/${file.name}`
        })
      }
    }
  } catch (e) {
    console.error('Error reading dir:', dirPath)
  }
  return items
}

export default defineConfig({
  base: '/full-stack-engineer-notes/',
  title: "嵌入式开发笔记",
  description: "个人嵌入式与全栈开发学习笔记",
  ignoreDeadLinks: true, // 忽略Markdown中的死链接
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/full-stack-engineer-notes/favicon.svg' }]
  ],
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '关于我', link: '/resume' },
      { text: 'GitHub', link: 'https://github.com/nxprfid/full-stack-engineer-notes' }
    ],
    sidebar: getSidebar(),
    search: {
      provider: 'local' // 启用本地全文搜索
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/nxprfid/full-stack-engineer-notes' }
    ],
    outline: {
      level: [2, 3],
      label: '目录'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    }
  },
  vite: {
    assetsInclude: ['**/*.JPG', '**/*.JPEG', '**/*.PNG'],
    build: {
      chunkSizeWarningLimit: 1500, // 提高警告阈值
      target: 'esnext', // 提升编译速度
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    }
  }
})
