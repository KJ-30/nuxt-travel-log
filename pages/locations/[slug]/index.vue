<template>
  <div class="min-h-screen bg-base-200">
    <div class="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content flex flex-col">
        <div class="navbar bg-base-100 shadow-sm">
          <div class="flex-none lg:hidden">
            <label for="my-drawer-2" class="btn btn-square btn-ghost">
              <Icon name="tabler:menu-2" size="24" />
            </label>
          </div>
          <div class="flex-1">
            <a class="btn btn-ghost text-xl">{{ location?.name }}</a>
          </div>
          <div class="flex-none gap-2">
            <button class="btn btn-ghost btn-sm" @click="navigateTo(`/locations/${slug}/edit`)">
              <Icon name="tabler:edit" size="18" />
              Edit
            </button>
            <NuxtLink :to="`/locations/${slug}/logs/new`" class="btn btn-primary btn-sm">
              <Icon name="tabler:plus" size="18" />
              Add Log
            </NuxtLink>
          </div>
        </div>

        <div class="flex-1 p-6">
          <div v-if="pending" class="flex justify-center items-center h-64">
            <span class="loading loading-spinner loading-lg"></span>
          </div>

          <div v-else-if="error" class="alert alert-error">
            <Icon name="tabler:alert-circle" size="20" />
            <span>Location not found</span>
          </div>

          <div v-else class="space-y-6">
            <div class="card bg-base-100 shadow-sm">
              <div class="card-body">
                <h1 class="text-3xl font-bold mb-2">{{ location.name }}</h1>
                <p v-if="location.description" class="text-base-content/70">{{ location.description }}</p>
                <div v-if="location.latitude && location.longitude" class="flex gap-2 mt-4">
                  <div class="badge badge-ghost">
                    <Icon name="tabler:map-pin" size="14" />
                    {{ location.latitude.toFixed(4) }}, {{ location.longitude.toFixed(4) }}
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold">Logs</h2>
              <NuxtLink :to="`/locations/${slug}/logs/new`" class="btn btn-primary btn-sm">
                <Icon name="tabler:plus" size="16" />
                Add Log
              </NuxtLink>
            </div>

            <div v-if="logsPending" class="flex justify-center items-center h-32">
              <span class="loading loading-spinner loading-lg"></span>
            </div>

            <div v-else-if="logs.length === 0" class="text-center py-8">
              <Icon name="tabler:book" size="48" class="text-base-content/30 mb-2" />
              <p class="text-base-content/60 mb-4">No logs yet</p>
              <NuxtLink :to="`/locations/${slug}/logs/new`" class="btn btn-primary btn-sm">
                <Icon name="tabler:plus" size="16" />
                Add Log
              </NuxtLink>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="log in logs"
                :key="log.id"
                class="card bg-base-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                @click="navigateTo(`/logs/${log.id}`)"
              >
                <div class="card-body">
                  <h3 class="card-title">{{ log.title }}</h3>
                  <p v-if="log.description" class="text-sm text-base-content/70 line-clamp-2">
                    {{ log.description }}
                  </p>
                  <div class="text-xs text-base-content/50 mt-2">
                    {{ formatDate(log.startDate) }} - {{ formatDate(log.endDate) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="drawer-side">
        <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
        <ul class="menu p-4 w-80 min-h-full bg-base-200">
          <li>
            <NuxtLink to="/dashboard" class="flex items-center gap-2">
              <Icon name="tabler:dashboard" size="20" />
              Dashboard
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/locations" class="flex items-center gap-2">
              <Icon name="tabler:map-pin" size="20" />
              Locations
            </NuxtLink>
          </li>
          <div class="divider"></div>
          <li v-if="location">
            <NuxtLink :to="`/locations/${slug}`" class="flex items-center gap-2 active">
              <Icon name="tabler:map-pin" size="20" />
              {{ location.name }}
            </NuxtLink>
          </li>
          <li v-if="location">
            <a class="flex items-center gap-2" @click="navigateTo(`/locations/${slug}/edit`)">
              <Icon name="tabler:edit" size="20" />
              Edit Location
            </a>
          </li>
          <div class="divider"></div>
          <li v-for="log in logs" :key="log.id">
            <NuxtLink :to="`/logs/${log.id}`" class="flex items-center gap-2">
              <Icon name="tabler:book" size="18" />
              {{ log.title }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const slug = route.params.slug;

const { data: location, pending, error } = await useFetch(`/api/locations/slug/${slug}`);
const { data: logs, pending: logsPending } = await useFetch("/api/logs", {
  query: { locationId: computed(() => location.value?.id) }
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

definePageMeta({
  middleware: ["auth"]
});
</script>
