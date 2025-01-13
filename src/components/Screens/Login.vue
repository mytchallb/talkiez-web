<template>
  <div class="flex justify-center items-center min-h-screen w-full ">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

      <h1 class="text-4xl font-bold text-orange-500 mb-10 text-center">Talkiez</h1>

      <form @submit.prevent="handleSubmit" class="flex flex-col space-y-4">
        <input 
          v-if="!isLogin"
          type="text" 
          v-model="name" 
          placeholder="Full Name"
          class="p-3 border border-gray-300 rounded-md text-base"
          required
        />
        <input 
          type="email" 
          v-model="email" 
          placeholder="Email"
          class="p-3 border border-gray-300 rounded-md text-base"
          required
        />
        <input 
          type="password" 
          v-model="password" 
          placeholder="Password"
          class="p-3 border border-gray-300 rounded-md text-base"
          required
        />

        <!-- Changed button to type="submit" -->
        <button 
          type="submit"
          class="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-md text-base cursor-pointer transition-colors"
        >
          {{ isLogin ? 'Login' : 'Register' }}
        </button>
        <p v-if="error" class="text-red-500 text-center">{{ error }}</p>
      </form>

      <!-- Toggle Link moved outside the form -->
      <p class="text-center mt-4">
        {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
        <a href="#" @click.prevent="isLogin = !isLogin" class="text-green-500 no-underline">
          {{ isLogin ? 'Register' : 'Login' }}
        </a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { mainStore } from '../../stores/store';
import { useRouter } from 'vue-router';
import { auth } from '../../lib/methods';

const store = mainStore();
const router = useRouter();

const isLogin = ref(true);
const email = ref('mytchall.bransgrove@gmail.com');
const password = ref('admin');
const name = ref('');
const error = ref('');
async function handleSubmit() {
  try {
    const result = isLogin.value
      ? await auth.login(email.value, password.value)
      : await auth.register(name.value, email.value, password.value);
      error.value = (result.success) ? '' : result.error;
    
  } catch (err) {
    console.error('Auth error:', err);
    error.value = 'An unexpected error occurred';
  }
}
</script>