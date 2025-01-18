<template>
  <div class="flex justify-center items-center min-h-screen w-full">
    <div class="bg-gray-medium p-8 rounded-lg shadow-md w-full max-w-md">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-white">Edit Profile</h1>
        <button
          @click="leaveProfileScreen"
          class="text-gray-light hover:text-gray-medium transition-colors rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-dark"
        >
          <svg class="w-5 h-5 fill-gray-light" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path
              d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"
            />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleUpdate" class="flex flex-col space-y-4 relative">
        <div class="flex flex-col space-y-1">
          <label for="name" class="text-gray-superlight text-base">Name</label>
          <input type="text" v-model="store.tempUser.name" required />
        </div>

        <PhoneNumber />

        <div class="flex flex-col space-y-1">
          <label for="email" class="text-gray-superlight text-base">Email</label>
          <input type="email" v-model="store.tempUser.email" required />
        </div>

        <!-- <div class="flex flex-col space-y-1">
          <label for="language" class="text-gray-superlight text-base">Language</label>
          <select v-model="store.tempUser.language">
            <option v-for="language in languages" :key="language.code" :value="language.code">{{ language.name }}</option>
          </select>
        </div> -->

        <div class="flex flex-col space-y-1">
          <label for="password" class="text-gray-superlight text-base">New Password (optional)</label>
          <input type="password" v-model="store.tempUser.password" class="p-3 border border-gray-300 rounded-md text-base" />
        </div>

        <button type="submit" class="btn">Save Changes</button>

        <div class="flex justify-center mt-8">
          <button @click.prevent="handleDelete" class="px-4 py-2 text-sm text-red-500 hover:text-red-700 hover:underline">Delete Account</button>
        </div>

        <p v-if="error" class="text-red-500 text-center">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { mainStore } from "@/stores/store"
import { user } from "@/lib/methods"
import PhoneNumber from "@/components/PhoneNumber.vue"
import { languages } from "@/lib/constants"
const store = mainStore()
const error = ref("")

onMounted(() => {
  // store.tempUser = JSON.parse(JSON.stringify(store.user))
})

async function handleUpdate() {
  try {
    await user.updateProfile()
    store.setUserFromTempUser()
    leaveProfileScreen()
  } catch (err) {
    console.error("Update error:", err)
    error.value = Object.values(err.errors).flat().join(" ")
  }
}

const leaveProfileScreen = () => {
  store.screen = "main"
}

async function handleDelete() {
  if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
    try {
      await user.deleteAccount()
    } catch (err) {
      console.error("Delete error:", err)
      error.value = "Failed to delete account"
    }
  }
}
</script>
