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
            <a class="btn btn-ghost text-xl">Travel Log Dashboard</a>
          </div>
          <div class="flex-none gap-2">
            <NuxtLink to="/locations/new" class="btn btn-primary btn-sm">
              <Icon name="tabler:plus" size="18" />
              Add Location
            </NuxtLink>
          </div>
        </div>

        <div class="flex-1 p-6">
          <div v-if="pending" class="flex justify-center items-center h-64">
            <span class="loading loading-spinner loading-lg"></span>
          </div>

          <div v-else-if="locations.length === 0" class="flex flex-col items-center justify-center h-64">
            <Icon name="tabler:map-pin" size="64" class="text-base-content/30 mb-4" />
            <h3 class="text-xl font-semibold mb-2">No locations yet</h3>
            <p class="text-base-content/60 mb-4">Start by adding your first travel location</p>
            <NuxtLink to="/locations/new" class="btn btn-primary">
              <Icon name="tabler:plus" size="18" />
              Add Location
            </NuxtLink>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="location in locations"
              :key="location.id"
              class="card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              @click="navigateTo(`/locations/${location.slug}`)"
            >
              <div class="card-body">
                <h2 class="card-title">
                  <Icon name="tabler:map-pin" size="20" />
                  {{ location.name }}
                </h2>
                <p v-if="location.description" class="text-sm text-base-content/70 line-clamp-2">
                  {{ location.description }}
                </p>
                <div class="card-actions justify-end mt-2">
                  <button class="btn btn-ghost btn-xs" @click.stop="navigateTo(`/locations/${location.slug}/edit`)">
                    <Icon name="tabler:edit" size="16" />
                  </button>
                  <button class="btn btn-ghost btn-xs text-error" @click.stop="deleteLocation(location.id, location.name)">
                    <Icon name="tabler:trash" size="16" />
                  </button>
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
const authStore = useAuthStore();
const { data: locations, pending, refresh } = await useFetch("/api/locations");

const locationToDelete = ref({ id: null, name: "" });
const deleting = ref(false);

const deleteLocation = (id, name) => {
  locationToDelete.value = { id, name };
  document.getElementById("delete_modal").showModal();
};

const confirmDelete = async () => {
  deleting.value = true;
  try {
    await $fetch(`/api/locations/${locationToDelete.value.id}`, { method: "DELETE" });
    refresh();
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
