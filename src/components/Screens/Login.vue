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
          <input type="text" v-model="name" required />
        </div>

        <div class="flex flex-col space-y-1">
          <label for="email" class="text-gray-superlight text-base">Email</label>
          <input type="email" v-model="email" required />
        </div>

        <div class="flex flex-col space-y-1">
          <label for="password" class="text-gray-superlight text-base">Password</label>
          <input type="password" v-model="password" required />
        </div>
        <!-- Changed button to type="submit" -->
        <div>
          <button type="submit" class="btn">
            {{ isLogin ? "Login" : "Register" }}
          </button>
        </div>
        <p v-if="error" class="text-red-500 text-center">{{ error }}</p>
      </form>

      <!-- Toggle Link moved outside the form -->
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
import { ref } from "vue"
import { mainStore } from "../../stores/store"
import { auth } from "../../lib/methods"

const store = mainStore()

const isLogin = ref(true)
const email = ref("mytchall.bransgrove@gmail.com")
const password = ref("admin")
const name = ref("")
const error = ref("")

const toggleLogin = () => {
  isLogin.value = !isLogin.value
  error.value = ""
}

async function handleLogin() {
  try {
    const result = await auth.login(email.value, password.value)
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
    const result = await auth.register(name.value, email.value, password.value)
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
