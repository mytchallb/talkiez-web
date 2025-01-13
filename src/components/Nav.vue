<template>
  <nav class="flex justify-center items-center py-4 relative w-full">
    <h1 class="text-4xl font-bold text-orange-500">Talkiez</h1>
    <div class="absolute top-2 right-2">
      <button 
        @click="goToProfile"
        class="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50"
      >
        {{ store.user?.name || 'Guest' }}
      </button>
    </div>
  </nav>
</template>

<script setup>
import { mainStore } from '../stores/store';

const store = mainStore();

const goToProfile = () => {
  store.screen = 'profile';
};
</script>