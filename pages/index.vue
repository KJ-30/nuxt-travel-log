<template>
  <div>
    <div class="hero min-h-[80vh] bg-base-100 mb-8">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">Welcome to Nuxt Travel Log</h1>
          <p class="py-6">记录您的旅行足迹，分享您的旅行故事。</p>
          <div class="flex gap-4 justify-center">
            <button class="btn btn-primary">
              <Icon name="material-symbols:edit" />
              开始记录
            </button>
            <button class="btn btn-outline">
              <Icon name="material-symbols:info-outline" />
              了解更多
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto max-w-5xl py-12">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-4">旅行日志功能</h2>
        <p class="text-lg">我们提供全面的旅行记录和分享功能</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body items-center text-center">
            <div class="bg-primary p-3 rounded-full">
              <Icon name="material-symbols:location-on" size="40" class="text-primary-content" />
            </div>
            <h3 class="card-title text-xl">地点管理</h3>
            <p>轻松记录和管理您去过的所有地点</p>
          </div>
        </div>

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body items-center text-center">
            <div class="bg-primary p-3 rounded-full">
              <Icon name="material-symbols:photo-library" size="40" class="text-primary-content" />
            </div>
            <h3 class="card-title text-xl">照片库</h3>
            <p>上传和整理您的旅行照片</p>
          </div>
        </div>

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body items-center text-center">
            <div class="bg-primary p-3 rounded-full">
              <Icon name="material-symbols:map" size="40" class="text-primary-content" />
            </div>
            <h3 class="card-title text-xl">地图可视化</h3>
            <p>在地图上查看您的旅行路线</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})
</script>