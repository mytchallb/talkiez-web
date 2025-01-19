<template>
  <Modal>
    <template v-if="modalState === 'edit'">
      <div class="flex justify-between items-center mb-4 sm:mb-8">
        <h1 class="text-3xl mb-0 font-bold text-white">Edit Profile</h1>
        <button
          @click="store.popModal"
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
          <label for="name" class="text-gray-superlight text-sm sm:text-base">Name*</label>
          <input type="text" v-model="store.tempUser.name" required />
        </div>

        <PhoneNumber />

        <div class="flex flex-col space-y-1">
          <label for="email" class="text-gray-superlight text-sm sm:text-base">Email*</label>
          <input type="email" v-model="store.tempUser.email" required />
        </div>

        <!-- <div class="flex flex-col space-y-1">
          <label for="language" class="text-gray-superlight text-base">Language</label>
          <select v-model="store.tempUser.language">
            <option v-for="language in languages" :key="language.code" :value="language.code">{{ language.name }}</option>
          </select>
        </div> -->

        <div class="flex flex-col space-y-1">
          <label for="password" class="text-gray-superlight text-sm sm:text-base">New Password</label>
          <input type="password" v-model="store.tempUser.password" class="p-3 border border-gray-300 rounded-md text-base" />
        </div>

        <button type="submit" class="btn">Save Changes</button>
      </form>
      <div class="flex justify-between mt-8">
        <button @click.prevent="modalState = 'delete'" class="btn danger transparent">Delete Account</button>
        <button @click="handleLogout" class="btn secondary">Logout</button>
      </div>

      <p v-if="error" class="!text-red-500 text-center">{{ error }}</p>
    </template>
    <template v-else-if="modalState === 'delete'">
      <h1 class="text-2xl font-bold mb-4">Are you sure?</h1>
      <p class="text-gray-600 mb-6">Deleting your account cannot be undone.</p>
      <div class="flex justify-end gap-4 mt-6">
        <button @click="modalState = 'edit'" class="btn">Cancel</button>

        <button @click="handleDelete" class="btn warning">Delete account</button>
      </div>
    </template>
  </Modal>
</template>
<script setup>
import { ref } from "vue"
import { mainStore } from "@/stores/store"
import Modal from "@/components/Modal.vue"
import { user, auth } from "@/lib/methods"
import PhoneNumber from "@/components/PhoneNumber.vue"

const store = mainStore()
const error = ref("")
const modalState = ref("edit") // edit, delete

async function handleUpdate() {
  try {
    await user.updateProfile()
    store.setUserFromTempUser()
    store.popModal()
  } catch (err) {
    console.error("Update error:", err)
    error.value = Object.values(err.errors).flat().join(" ")
  }
}

async function handleDelete() {
  try {
    await user.deleteAccount()
  } catch (err) {
    console.error("Delete error:", err)
    error.value = "Failed to delete account"
  }
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
