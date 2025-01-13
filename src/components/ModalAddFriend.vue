<template>
  <div v-if="store.modals.addFriend" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg min-w-[260px] max-w-screen-md mx-auto">
      <template v-if="modalState === 'add'">
      <h1 class="text-2xl font-bold mb-4">Add Friend</h1>
      <p class="text-gray-600 mb-6">Send a friend request to a phone number or email address.</p>
      <div class="flex flex-col gap-4">
        <input type="text" v-model="phone" placeholder="Phone Number" class="p-2 border border-gray-300 rounded-md" />
        <p class="text-gray-400 text-center">- or -</p>
        <input type="text" v-model="email" placeholder="Email Address" class="p-2 border border-gray-300 rounded-md" />
      </div>
      <div class="flex justify-end gap-4 mt-6">
        <button @click="store.modals.addFriend = false" class="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
        <button @click="addFriend" class="bg-blue-500 text-white px-4 py-2 rounded-md">Add Friend</button>
      </div>
      <div v-if="errorMsg" class="mt-4">
        <p class="text-red-500">{{ errorMsg }}</p>
      </div>
    </template>
    <template v-else>
      <h1 class="text-2xl font-bold mb-4">Success</h1>
      <p class="text-gray-600 mb-6">Friend request sent!</p>
      <button @click="finishModal" class="bg-gray-500 text-white px-4 py-2 rounded-md">Ok</button>
    </template>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { mainStore } from '../stores/store';
import { sendFriendRequest } from '@/lib/methods'

const store = mainStore();
const phone = ref('');
const email = ref('');
const modalState = ref('add'); // add, success
const errorMsg = ref('');

const addFriend = async () => {
  errorMsg.value = '';
  try {
    await sendFriendRequest(phone.value.trim() || '', email.value.trim() || '');
    modalState.value = 'success';
  } catch (error) {
    if (error.errors && Object.keys(error.errors).length > 0) {
      const messages = Object.values(error.errors)
        .flat()
        .join('\n');
      errorMsg.value = messages;
    } else {
      errorMsg.value = error.message || 'An error occurred';
    }
  }
}

const finishModal = () => {
  store.modals.addFriend = false;
  modalState.value = 'add';
}

</script>