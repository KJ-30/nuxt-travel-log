<template>
  <div class="min-h-screen bg-base-200" :data-theme="currentTheme">
    <header class="navbar bg-primary text-primary-content">
      <div class="navbar-start">
        <a class="btn btn-ghost text-xl">Nuxt Travel Log</a>
      </div>
      <div class="navbar-center">
        <ul class="menu menu-horizontal flex">
          <li><NuxtLink to="/">Home</NuxtLink></li>
          <li><NuxtLink to="/about">About</NuxtLink></li>
        </ul>
      </div>
      <div class="navbar-end">
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost m-1">
            <Icon name="material-symbols:dark-mode" size="1.5em" />
          </div>
          <ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mt-4">
            <li><a @click="setTheme('light')">Light</a></li>
            <li><a @click="setTheme('dark')">Dark</a></li>
            <li><a @click="setTheme('cupcake')">Cupcake</a></li>
          </ul>
        </div>
      </div>
    </header>

    <main class="container mx-auto p-4">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </main>

    <footer class="footer footer-center p-4 bg-base-300 text-base-content">
      <div>
        <p>Copyright © 2025 - All right reserved</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const currentTheme = ref('light');

const setTheme = (theme) => {
  currentTheme.value = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
});
</script>
