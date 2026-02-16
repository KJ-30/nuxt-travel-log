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
            <a class="btn btn-ghost text-xl">New Location</a>
          </div>
        </div>

        <div class="flex-1 p-6">
          <div class="max-w-2xl mx-auto">
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div class="card bg-base-100 shadow-sm">
                <div class="card-body">
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text">Name *</span>
                    </label>
                    <input
                      v-model="form.name"
                      type="text"
                      placeholder="Location name"
                      class="input input-bordered"
                      required
                    />
                  </div>

                  <div class="form-control">
                    <label class="label">
                      <span class="label-text">Slug *</span>
                    </label>
                    <input
                      v-model="form.slug"
                      type="text"
                      placeholder="location-slug"
                      class="input input-bordered"
                      required
                    />
                    <label class="label">
                      <span class="label-text-alt">URL-friendly identifier</span>
                    </label>
                  </div>

                  <div class="form-control">
                    <label class="label">
                      <span class="label-text">Description</span>
                    </label>
                    <textarea
                      v-model="form.description"
                      placeholder="Description of the location"
                      class="textarea textarea-bordered"
                      rows="3"
                    ></textarea>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text">Latitude</span>
                      </label>
                      <input
                        v-model.number="form.latitude"
                        type="number"
                        step="any"
                        placeholder="0.0000"
                        class="input input-bordered"
                      />
                    </div>

                    <div class="form-control">
                      <label class="label">
                        <span class="label-text">Longitude</span>
                      </label>
                      <input
                        v-model.number="form.longitude"
                        type="number"
                        step="any"
                        placeholder="0.0000"
                        class="input input-bordered"
                      />
                    </div>
                  </div>

                  <div class="divider">Map</div>

                  <div class="form-control">
                    <label class="label">
                      <span class="label-text">Search Location</span>
                    </label>
                    <div class="join">
                      <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search for a place..."
                        class="input input-bordered join-item flex-1"
                      />
                      <button type="button" class="btn btn-primary join-item" @click="searchLocation">
                        <Icon name="tabler:search" size="18" />
                      </button>
                    </div>
                  </div>

                  <div class="h-64 bg-base-200 rounded-lg relative overflow-hidden">
                    <div class="absolute inset-0 flex items-center justify-center text-base-content/50">
                      <div class="text-center">
                        <Icon name="tabler:map" size="48" />
                        <p class="mt-2">Map placeholder</p>
                        <p class="text-sm">Click to set coordinates</p>
                      </div>
                    </div>
                    <div
                      class="absolute inset-0 cursor-pointer"
                      @click="handleMapClick"
                    ></div>
                    <div
                      v-if="form.latitude && form.longitude"
                      class="absolute w-4 h-4 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2"
                      :style="{
                        left: '50%',
                        top: '50%'
                      }"
                    ></div>
                  </div>

                  <div class="card-actions justify-end">
                    <button type="button" class="btn btn-ghost" @click="navigateTo('/locations')">
                      Cancel
                    </button>
                    <button type="submit" class="btn btn-primary" :disabled="submitting">
                      <span v-if="submitting" class="loading loading-spinner loading-sm"></span>
                      <Icon v-else name="tabler:check" size="18" />
                      Create Location
                    </button>
                  </div>
                </div>
              </div>
            </form>
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
            <NuxtLink to="/locations/new" class="flex items-center gap-2 active">
              <Icon name="tabler:plus" size="20" />
              Add Location
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const form = ref({
  name: "",
  slug: "",
  description: "",
  latitude: null,
  longitude: null,
});

const searchQuery = ref("");
const submitting = ref(false);

const handleMapClick = (event) => {
  const rect = event.target.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  form.value.latitude = 40.7128 + (y / rect.height - 0.5) * 0.1;
  form.value.longitude = -74.0060 + (x / rect.width - 0.5) * 0.1;
};

const searchLocation = async () => {
  if (!searchQuery.value) return;
  
  try {
    const response = await $fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.value)}`);
    if (response && response.length > 0) {
      const result = response[0];
      form.value.latitude = parseFloat(result.lat);
      form.value.longitude = parseFloat(result.lon);
    }
  } catch (error) {
    console.error("Search failed:", error);
  }
};

const handleSubmit = async () => {
  submitting.value = true;
  try {
    await $fetch("/api/locations", {
      method: "POST",
      body: form.value,
    });
    await navigateTo("/locations");
  } catch (error) {
    console.error("Failed to create location:", error);
  } finally {
    submitting.value = false;
  }
};

definePageMeta({
  middleware: ["auth"]
});
</script>
