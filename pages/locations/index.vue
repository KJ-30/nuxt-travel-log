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
            <a class="btn btn-ghost text-xl">Locations</a>
          </div>
          <div class="flex-none gap-2">
            <NuxtLink to="/locations/new" class="btn btn-primary btn-sm">
              <Icon name="tabler:plus" size="18" />
              Add Location
            </NuxtLink>
          </div>
        </div>

        <div class="flex-1 p-6">
          <div class="flex gap-6">
            <div class="w-1/3">
              <div v-if="pending" class="flex justify-center items-center h-64">
                <span class="loading loading-spinner loading-lg"></span>
              </div>

              <div v-else-if="locations.length === 0" class="text-center py-8">
                <Icon name="tabler:map-pin" size="48" class="text-base-content/30 mb-2" />
                <p class="text-base-content/60">No locations yet</p>
              </div>

              <ul v-else class="menu bg-base-100 rounded-box shadow-sm">
                <li v-for="location in locations" :key="location.id">
                  <a 
                    class="flex items-center gap-2"
                    @click="selectedLocation = location; fetchLogs(location.id)"
                  >
                    <Icon name="tabler:map-pin" size="18" />
                    {{ location.name }}
                  </a>
                </li>
              </ul>
            </div>

            <div class="flex-1">
              <div v-if="!selectedLocation" class="flex flex-col items-center justify-center h-96">
                <Icon name="tabler:map" size="64" class="text-base-content/30 mb-4" />
                <h3 class="text-xl font-semibold mb-2">Select a location</h3>
                <p class="text-base-content/60">Choose a location from the sidebar to view details</p>
              </div>

              <div v-else>
                <div class="card bg-base-100 shadow-sm mb-6">
                  <div class="card-body">
                    <h2 class="card-title text-2xl">{{ selectedLocation.name }}</h2>
                    <p v-if="selectedLocation.description">{{ selectedLocation.description }}</p>
                    <div class="card-actions justify-end mt-4">
                      <button class="btn btn-ghost btn-sm" @click="navigateTo(`/locations/${selectedLocation.slug}/edit`)">
                        <Icon name="tabler:edit" size="18" />
                        Edit
                      </button>
                      <button class="btn btn-ghost btn-sm text-error" @click="deleteLocation(selectedLocation.id, selectedLocation.name)">
                        <Icon name="tabler:trash" size="18" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold">Logs</h3>
                  <NuxtLink :to="`/locations/${selectedLocation.slug}/logs/new`" class="btn btn-primary btn-sm">
                    <Icon name="tabler:plus" size="16" />
                    Add Log
                  </NuxtLink>
                </div>

                <div v-if="logsPending" class="flex justify-center items-center h-32">
                  <span class="loading loading-spinner loading-lg"></span>
                </div>

                <div v-else-if="logs.length === 0" class="text-center py-8">
                  <Icon name="tabler:book" size="48" class="text-base-content/30 mb-2" />
                  <p class="text-base-content/60">No logs yet</p>
                </div>

                <div v-else class="space-y-4">
                  <div
                    v-for="log in logs"
                    :key="log.id"
                    class="card bg-base-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    @click="navigateTo(`/logs/${log.id}`)"
                  >
                    <div class="card-body">
                      <h4 class="card-title">{{ log.title }}</h4>
                      <p v-if="log.description" class="text-sm text-base-content/70 line-clamp-1">
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
            <NuxtLink to="/locations" class="flex items-center gap-2 active">
              <Icon name="tabler:map-pin" size="20" />
              Locations
            </NuxtLink>
          </li>
          <div class="divider"></div>
          <li>
            <NuxtLink to="/locations/new" class="flex items-center gap-2">
              <Icon name="tabler:plus" size="20" />
              Add Location
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <dialog id="delete_modal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Delete Location</h3>
        <p class="py-4">Are you sure you want to delete "{{ locationToDelete.name }}"? This will also delete all logs and images associated with this location.</p>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn">Cancel</button>
          </form>
          <button class="btn btn-error" @click="confirmDelete">
            <span v-if="deleting" class="loading loading-spinner loading-sm"></span>
            Delete
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup>
const { data: locations, pending } = await useFetch("/api/locations");
const selectedLocation = ref(null);
const { data: logs, pending: logsPending, refresh: refreshLogs } = await useFetch("/api/logs", {
  query: { locationId: computed(() => selectedLocation.value?.id) }
});

const locationToDelete = ref({ id: null, name: "" });
const deleting = ref(false);

const fetchLogs = (locationId) => {
  refreshLogs();
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const deleteLocation = (id, name) => {
  locationToDelete.value = { id, name };
  document.getElementById("delete_modal").showModal();
};

const confirmDelete = async () => {
  deleting.value = true;
  try {
    await $fetch(`/api/locations/${locationToDelete.value.id}`, { method: "DELETE" });
    await refreshNuxtData();
    selectedLocation.value = null;
    document.getElementById("delete_modal").close();
  } catch (error) {
    console.error("Failed to delete location:", error);
  } finally {
    deleting.value = false;
  }
};

definePageMeta({
  middleware: ["auth"]
});
</script>
