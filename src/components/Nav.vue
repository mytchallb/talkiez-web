<template>
  <nav class="flex justify-between items-center relative w-full bg-gray-medium py-4 px-8">
    <div class="flex items-center gap-2">
      <img src="/logo.png" alt="Talkiez" class="w-10 h-10 object-contain" />
      <h1 class="text-4xl mb-0 font-bold text-primary xs:block hidden">Talkiez</h1>
    </div>
    <div class="flex items-center gap-4 justify-center">
      <div>
        <button @click="goToProfile" class="p-2 rounded-full flex items-center gap-2 px-4 border border-primary text-primary">
          <svg class="w-4 h-4 fill-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path
              d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"
            />
          </svg>
          <span class="xs:block hidden">
            {{ store.user?.name || "Guest" }}
          </span>
        </button>
      </div>
      <div>
        <button title="Logout" @click="handleLogout" class="rounded-full flex items-center p-3 hover:bg-gray-dark w-10 h-10">
          <svg class="w-full h-full fill-gray-light" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { mainStore } from "../stores/store"
import { auth } from "../lib/methods"

const store = mainStore()

const goToProfile = () => {
  store.modals.push("profile")
}

async function handleLogout() {
  try {
    await auth.logout()
  } catch (err) {
    console.error("Logout error:", err)
    error.value = "Failed to logout"
  }
}
</script>
