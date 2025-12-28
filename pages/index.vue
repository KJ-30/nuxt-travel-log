<template>
  <div>
    <div class="hero min-h-[80vh] bg-base-100 mb-8">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <!-- 修改标题 -->
          <h1 class="text-5xl font-bold">Travel Log</h1>
          <!-- 添加描述性段落 -->
          <p class="py-6">Keep track of your travels and adventures. Add locations, photos, and notes to create a digital journal of your journeys.</p>
          <!-- 更新按钮样式和文本 -->
          <button class="btn btn-accent" @click="signIn">
            Sign In
            <Icon name="material-symbols:login" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
});

// 新增签入功能
const signIn = () => {
  // 处理签入逻辑
};
</script>
