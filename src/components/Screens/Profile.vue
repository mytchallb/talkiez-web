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
          <input type="text" v-model="name" class="p-3 border border-gray-300 rounded-md text-base" required />
        </div>

        <div class="flex flex-col space-y-1">
          <label for="email" class="text-gray-superlight text-base">Email</label>
          <input type="email" v-model="email" class="p-3 border border-gray-300 rounded-md text-base" required />
        </div>

        <div class="flex flex-col space-y-1">
          <label for="phone" class="text-gray-superlight text-base">Phone Number</label>
          <input type="text" v-model="phone" class="p-3 border border-gray-300 rounded-md text-base" />
        </div>

        <div class="flex flex-col space-y-1">
          <label for="password" class="text-gray-superlight text-base">New Password (optional)</label>
          <input type="password" v-model="password" class="p-3 border border-gray-300 rounded-md text-base" />
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

const store = mainStore()

const name = ref("")
const email = ref("")
const password = ref("")
const phone = ref("")
const error = ref("")
const originalUser = ref(null)

onMounted(async () => {
  const user = store.user
  if (user) {
    name.value = user.name
    email.value = user.email
    phone.value = user.phone
    originalUser.value = { ...user }
  }
})

async function handleUpdate() {
  const hasChanges =
    name.value !== originalUser.value?.name || email.value !== originalUser.value?.email || phone.value !== originalUser.value?.phone || password.value !== ""

  if (!hasChanges) {
    console.log("No changes detected, closing profile screen")
    leaveProfileScreen()
    return
  }

  try {
    await user.updateProfile({
      name: name.value,
      email: email.value,
      password: password.value,
      phone: phone.value,
    })
    error.value = ""
    leaveProfileScreen()
  } catch (err) {
    console.error("Update error:", err)
    error.value = "Failed to update profile"
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
