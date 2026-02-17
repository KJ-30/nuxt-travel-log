<script setup>
definePageMeta({
  layout: false,
})
</script>

<template>
  <div>
    <div class="hero min-h-[30vh] bg-base-100 mb-8">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-4xl font-bold">
            关于我们
          </h1>
          <p class="py-4">
            了解我们的旅行日志应用
          </p>
        </div>
      </div>
    </div>

    <div class="container mx-auto max-w-4xl">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-2xl">
            旅行日志应用
          </h2>
          <p>这是一个用于记录和分享您旅行经历的应用程序。使用 Nuxt.js、Tailwind CSS 和 daisyUI 构建，提供美观且响应式的用户体验。</p>

          <div class="mt-4">
            <h3 class="text-xl font-semibold mb-2">
              功能特性
            </h3>
            <ul class="list-disc pl-6 space-y-1">
              <li>记录旅行地点和经历</li>
              <li>上传和管理旅行照片</li>
              <li>在地图上可视化您的旅行路线</li>
              <li>与朋友分享您的旅行故事</li>
            </ul>
          </div>

          <div class="card-actions justify-end mt-6">
            <NuxtLink to="/" class="btn btn-primary">
              返回首页
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
