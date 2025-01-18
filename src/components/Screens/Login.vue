<template>
  <div class="flex justify-center items-center min-h-screen w-full">
    <div class="bg-gray-medium p-8 rounded-lg shadow-md w-full max-w-md">
      <div class="flex items-center justify-center gap-2 mb-4">
        <img src="/logo.png" alt="Talkiez" class="w-10 h-10 object-contain" />
        <h1 class="text-4xl font-bold text-white">Talkiez</h1>
      </div>

      <form @submit.prevent="handleSubmit" class="flex flex-col space-y-4">
        <div class="flex flex-col space-y-1" v-if="!isLogin">
          <label for="name" class="text-gray-superlight text-base">Name</label>
          <input type="text" v-model="store.tempUser.name" required />
        </div>

        <PhoneNumber v-if="!isLogin" />

        <div class="flex flex-col space-y-1">
          <label for="email" class="text-gray-superlight text-base">Email</label>
          <input type="email" v-model="store.tempUser.email" required />
        </div>

        <div class="flex flex-col space-y-1">
          <label for="password" class="text-gray-superlight text-base">Password</label>
          <input type="password" v-model="store.tempUser.password" required />
        </div>

        <div v-if="showApi" class="flex flex-col space-y-1">
          <label for="api" class="text-gray-superlight text-base">API</label>
          <input type="text" v-model="store.api" required />
        </div>

        <div class="flex">
          <button
            type="button"
            @click="showApi = !showApi"
            :class="[
              'rounded-lg p-2 rounded-r-none flex items-center justify-center border-r border-gray-medium',
              showApi ? 'bg-black text-primary' : 'bg-primary',
            ]"
          >
            <svg :class="['w-6', showApi ? 'fill-primary' : 'fill-black']" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
              <path
                d="M0 336c0 79.5 64.5 144 144 144l368 0c70.7 0 128-57.3 128-128c0-61.9-44-113.6-102.4-125.4c4.1-10.7 6.4-22.4 6.4-34.6c0-53-43-96-96-96c-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32C167.6 32 96 103.6 96 192c0 2.7 .1 5.4 .2 8.1C40.2 219.8 0 273.2 0 336z"
              />
            </svg>
          </button>
          <button type="submit" class="btn !mt-0 !rounded-l-none">
            {{ isLogin ? "Login" : "Register" }}
          </button>
        </div>

        <p v-if="error" class="text-red-500 text-center">{{ error }}</p>
      </form>

      <p class="text-center mt-8 text-gray-superlight">
        {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
        <a href="#" @click.prevent="toggleLogin" class="font-bold no-underline">
          {{ isLogin ? "Register" : "Login" }}
        </a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { mainStore } from "@/stores/store"
import { auth } from "@/lib/methods"
import PhoneNumber from "@/components/PhoneNumber.vue"

const store = mainStore()
const isLogin = ref(true)
const error = ref("")
const showApi = ref(false)
const toggleLogin = () => {
  isLogin.value = !isLogin.value
  error.value = ""
}

async function handleLogin() {
  if (!(await auth.alive())) {
    error.value = "API server is not responding"
    return
  }

  try {
    const result = await auth.login()
    error.value = result.success ? "" : result.error
    if (result.success) {
      store.screen = "main"
    }
  } catch (err) {
    console.error("Login error:", err)
    if (err.status === 401) {
      error.value = "Invalid email or password"
    } else {
      error.value = "An unexpected error occurred"
    }
  }
}

async function handleRegister() {
  try {
    const result = await auth.register()
    error.value = result.success ? "" : result.error
    if (result.success) {
      isLogin.value = true // Switch to login view after successful registration
      await handleLogin() // Automatically log in after registration
    }
  } catch (err) {
    console.error("Registration error:", err)
    error.value = "An unexpected error occurred"
  }
}

async function handleSubmit() {
  if (isLogin.value) {
    await handleLogin()
  } else {
    await handleRegister()
  }
}
</script>
