<template>
  <!-- Contact List -->
  <div class="w-full mt-auto py-5 bg-gray-medium">
    <div class="flex justify-center gap-5 px-5 pb-2">
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
        <div v-if="hasPendingTransmissions(friend.id)" class="absolute -left-1 -top-1 w-6 h-6 bg-blue border-black border rounded-full"></div>
        <div class="w-16 h-16 rounded-full flex items-center justify-center mb-1" :class="store.selectedContact === friend ? 'bg-blue' : 'bg-gray-light'">
          <span class="text-sm text-white">{{ friend.name }}</span>
        </div>
      </div>

      <!-- Add Contact Button -->
      <div class="flex flex-col items-center group cursor-pointer flex-shrink-0" @click="store.modals.addFriend = true">
        <div
          class="w-16 h-16 rounded-full border-2 border-dotted border-gray-light group-hover:border-white transition-colors flex items-center justify-center mb-1"
        >
          <span class="text-2xl text-gray-light group-hover:text-white transition-colors">+</span>
        </div>
      </div>
    </div>
  </div>
  <ModalAddFriend />
</template>
<script setup>
import { mainStore } from "../stores/store"
import ModalAddFriend from "@/components/ModalAddFriend.vue"
import { cancelFriendRequest, transmissions } from "../lib/methods"
const store = mainStore()

const hasPendingTransmissions = (friendId) => {
  return store.transmissions.some((t) => t.sender_id === friendId && t.status === "pending")
}

const selectContact = async (friend) => {
  console.log("selectContact", friend)
  if (friend.status === "pending") {
    console.log("Friend has pending transmissions")
    return
  }
  store.selectedContact = friend
  store.modals.addFriend = false

  // Need to play any pending audio transmissions (waiting til each one is finished playing before playing the next one)
  const pendingTransmissions = store.transmissions.filter((t) => t.sender_id === friend.id && t.status === "pending")
  console.log("pendingTransmissions", pendingTransmissions)
  if (pendingTransmissions.length > 0) {
    for (const t of pendingTransmissions) {
      await transmissions.playTransmission(t)
      store.transmissions = store.transmissions.filter((trans) => trans.id !== t.id)
    }
  }
}
</script>
