<template>
  <div class="flex justify-center items-center min-h-screen w-full">
    <button 
      @click="leaveProfileScreen" 
      class="absolute top-4 left-4 text-gray-600 hover:text-gray-800"
    >
      ← Back
    </button>

    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-4xl font-bold text-orange-500 mb-10 text-center">Profile</h1>

      <form @submit.prevent="handleUpdate" class="flex flex-col space-y-4">
        <input 
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
          type="text" 
          v-model="phone" 
          placeholder="Phone Number"
          class="p-3 border border-gray-300 rounded-md text-base"
        />
        <input 
          type="password" 
          v-model="password" 
          placeholder="New Password (optional)"
          class="p-3 border border-gray-300 rounded-md text-base"
        />

        <button 
          type="submit"
          class="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-md text-base cursor-pointer transition-colors"
        >
          Update Profile
        </button>

        <div class="flex justify-center mt-8">
          <button 
            @click.prevent="handleDelete"
            class="px-4 py-2 text-sm text-red-500 hover:text-red-700 hover:underline"
          >
            Delete Account
          </button>
        </div>

        <div class="flex justify-center">
          <button 
            @click.prevent="handleLogout"
            class="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:underline"
          >
            Log Out
          </button>
        </div>

        <p v-if="error" class="text-red-500 text-center">{{ error }}</p>
        <p v-if="success" class="text-green-500 text-center">{{ success }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { mainStore } from '@/stores/store';
import { auth, user } from '@/lib/methods';

const store = mainStore();

const name = ref('');
const email = ref('');
const password = ref('');
const phone = ref('');
const error = ref('');
const success = ref('');

onMounted(async () => {
  // Assuming you have a user object in your store
  const user = store.user;
  if (user) {
    name.value = user.name;
    email.value = user.email;
    phone.value = user.phone;
  }
});

async function handleUpdate() {
  try {
    await user.updateProfile({
      name: name.value,
      email: email.value,
      password: password.value,
      phone: phone.value
    });
    success.value = 'Profile updated successfully';
    error.value = '';
  } catch (err) {
    console.error('Update error:', err);
    error.value = 'Failed to update profile';
    success.value = '';
  }
}

const leaveProfileScreen = () => {
  store.screen = 'main';
}

async function handleDelete() {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    try {
      await user.deleteAccount();
    } catch (err) {
      console.error('Delete error:', err);
      error.value = 'Failed to delete account';
    }
  }
}

async function handleLogout() {
  try {
    await auth.logout();
  } catch (err) {
    console.error('Logout error:', err);
    error.value = 'Failed to logout';
  }
}
</script>