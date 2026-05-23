<script setup>
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import { ref, watch, onMounted, nextTick } from 'vue'

const { Layout } = DefaultTheme
const route = useRoute()

// 指定需要密码保护的页面（URL 中的部分字符串）
const protectedPages = [
  '金蝶操作文档',
  'PHY6252',
  '编译系统笔记',
  'LED%20Strip%20Driver' // 兼容 URL 编码
]

const isLocked = ref(false)
const password = ref('')
const error = ref('')

// 检查当前页面是否需要密码，并控制内容显示
const checkLock = () => {
  const currentPath = decodeURIComponent(route.path)
  // 判断路径是否包含受保护的关键字
  const isProtected = protectedPages.some(p => {
    return currentPath.includes(decodeURIComponent(p))
  })
  
  if (isProtected) {
    const unlocked = sessionStorage.getItem('unlocked_' + currentPath)
    if (!unlocked) {
      isLocked.value = true
      hideContent(true)
    } else {
      isLocked.value = false
      hideContent(false)
    }
  } else {
    isLocked.value = false
    hideContent(false)
  }
}

// 通过操作 DOM 隐藏 VitePress 默认渲染的内容区域
const hideContent = (hide) => {
  if (typeof document === 'undefined') return
  nextTick(() => {
    // VitePress 默认文档内容都在 .vp-doc 内部
    const content = document.querySelector('.vp-doc > div')
    if (content) {
      content.style.display = hide ? 'none' : 'block'
    }
  })
}

onMounted(() => {
  checkLock()
  
  // 动态注入不蒜子统计脚本
  const script = document.createElement('script')
  script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
  script.async = true
  document.head.appendChild(script)
})

watch(() => route.path, () => {
  checkLock()
  password.value = ''
  error.value = ''
})

const verifyPassword = () => {
  // 这里设置文档统一的访问密码，例如 123456
  if (password.value === '123456') {
    const currentPath = decodeURIComponent(route.path)
    sessionStorage.setItem('unlocked_' + currentPath, 'true')
    isLocked.value = false
    hideContent(false)
    error.value = ''
  } else {
    error.value = '密码错误，请重试'
  }
}
</script>

<template>
  <Layout>
    <!-- doc-before 插槽位于文档正文内容的最上方 -->
    <template #doc-before>
      <div v-if="isLocked" class="password-mask">
        <h2>🔒 该文档需要密码访问</h2>
        <p>请输入密码以查看内容 (默认密码: 123456)</p>
        <div class="input-group">
          <input 
            type="password" 
            v-model="password" 
            @keyup.enter="verifyPassword" 
            placeholder="请输入密码" 
          />
          <button @click="verifyPassword">确认</button>
        </div>
        <p v-if="error" class="error">{{ error }}</p>
      </div>
    </template>
    
    <!-- layout-bottom 插槽位于页面最底部，适合放全局统计信息 -->
    <template #layout-bottom>
      <div class="footer-stats">
        <span>👀 本站总访问量: <span id="busuanzi_value_site_pv"></span> 次</span>
        <span class="divider">|</span>
        <span>👤 今日独立访客: <span id="busuanzi_value_site_uv"></span> 人</span>
      </div>
    </template>
  </Layout>
</template>

<style scoped>
.password-mask {
  padding: 40px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  text-align: center;
  margin-bottom: 20px;
  border: 1px solid var(--vp-c-divider);
}
.input-group {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  gap: 10px;
}
input[type="password"] {
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
button {
  padding: 8px 16px;
  background: var(--vp-c-brand);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
button:hover {
  background: var(--vp-c-brand-dark);
}
.error {
  color: var(--vp-c-danger-1);
  font-size: 14px;
  margin-top: 10px;
}
.footer-stats {
  text-align: center;
  padding: 20px;
  font-size: 14px;
  color: var(--vp-c-text-2);
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}
.divider {
  margin: 0 10px;
}
</style>
