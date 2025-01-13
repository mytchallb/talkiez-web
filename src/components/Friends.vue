<template>
  <!-- Contact List -->
  <div class="w-full mt-auto py-5">
    <div class="flex  gap-5 px-5 pb-2">
      <div 
        v-for="friend in store.friends" 
        :key="friend.id"
        class="flex flex-col items-center cursor-pointer flex-shrink-0 relative"
        @click="selectContact(friend)"
      >
        <div 
          v-if="friend.status === 'pending'"
          class="absolute -right-2 -top-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center cursor-pointer z-10"
          @click.stop="cancelFriendRequest(friend.id)"
        >
          <span class="text-white text-sm">×</span>
        </div>
        <div 
          v-if="hasPendingTransmissions(friend.id)"
          class="absolute -left-1 -top-1 w-6 h-6 bg-red-500 rounded-full"
        ></div>
        <div 
          class="w-16 h-16 rounded-full flex items-center justify-center mb-1"
          :style="{ backgroundColor: store.selectedContact === friend ? '#f97316' : nameHashToColor(friend.name) }"
        ></div>
        <span 
          class="text-sm"
          :class="store.selectedContact === friend ? 'text-orange-500' : 'text-white'"
        >{{ friend.name }}</span>
        <span v-if="friend.status === 'pending'" class="text-gray-300 uppercase text-sm font-bold">(Pending)</span>
      </div>
      
      <!-- Add Contact Button -->
      <div 
        class="flex flex-col items-center cursor-pointer flex-shrink-0"
        @click="store.modals.addFriend = true"
      >
        <div class="w-16 h-16 rounded-full border-2 border-orange-500 flex items-center justify-center mb-1">
          <span class="text-2xl text-orange-500">+</span>
        </div>
        <span class="text-sm text-gray-700">Add</span>
      </div>
    </div>
  </div>
  <ModalAddFriend />
</template>
<script setup>
import { mainStore } from '../stores/store';
import ModalAddFriend from '@/components/ModalAddFriend.vue';
import { cancelFriendRequest, transmissions } from '../lib/methods';
const store = mainStore();

const nameHashToColor = (name) => {
  // Create a simple hash of the name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Convert to HSL to ensure dark but saturated colors
  const h = Math.abs(hash % 360);  // Hue: 0-360
  const s = 70 + (hash % 30);      // Saturation: 70-100%
  const l = 25 + (hash % 15);      // Lightness: 25-40% (keeping it dark)
  
  return `hsl(${h}, ${s}%, ${l}%)`;
}

const hasPendingTransmissions = (friendId) => {
  return store.transmissions.some(t => 
    t.sender_id === friendId && 
    t.status === 'pending'
  );
};

const selectContact = async (friend) => {
  console.log('selectContact', friend)
  if (friend.status === 'pending') {
    console.log('Friend has pending transmissions');
    return;
  }
  store.selectedContact = friend;
  store.modals.addFriend = false;

  // Need to play any pending audio transmissions (waiting til each one is finished playing before playing the next one)
  const pendingTransmissions = store.transmissions.filter(t => t.sender_id === friend.id && t.status === 'pending');
  console.log('pendingTransmissions', pendingTransmissions)
  if (pendingTransmissions.length > 0) {
    for (const t of pendingTransmissions) {
      await transmissions.playTransmission(t);
      store.transmissions = store.transmissions.filter(trans => trans.id !== t.id);
    }
  }
}

</script>