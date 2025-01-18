<template>
  <!-- Contact List -->
  <div class="w-full mt-auto bg-gray-medium">
    <div class="flex justify-center gap-5 px-5 py-5" @click="store.selectedContact = null">
      <!-- Accepted Friends -->
      <div
        v-for="friend in acceptedFriends"
        :key="friend.id"
        class="flex flex-col items-center cursor-pointer flex-shrink-0 relative"
        @click.stop="selectContact(friend)"
      >
        <div v-if="hasPendingTransmissions(friend.id)" class="absolute -left-1 -top-1 w-6 h-6 bg-blue border-black border rounded-full"></div>
        <div class="w-16 h-16 rounded-full flex items-center justify-center mb-1" :class="store.selectedContact === friend ? 'bg-blue' : 'bg-gray-light'">
          <span class="text-sm text-white text-center">{{ friend.name }}</span>
        </div>
      </div>

      <!-- Add Contact Button -->
      <div class="flex flex-col items-center group cursor-pointer flex-shrink-0" @click="store.modals.push('addFriend')">
        <div
          class="w-16 h-16 rounded-full border-2 border-dotted border-gray-light group-hover:border-white transition-colors flex items-center justify-center mb-1"
        >
          <span class="text-2xl text-gray-light group-hover:text-white transition-colors">+</span>
        </div>
      </div>

      <!-- Friend Requests -->
      <div v-if="outgoingRequests.length > 0 || incomingRequests.length > 0" class="flex items-center gap-2 border-l border-gray-light pl-4">
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <!-- Outgoing Requests -->
            <div
              :data-request-id="friend.id"
              v-for="friend in outgoingRequests"
              :key="friend.id"
              class="flex flex-col items-center cursor-pointer flex-shrink-0 relative"
            >
              <div
                class="absolute left-1/2 -translate-x-1/2 -bottom-3 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center cursor-pointer z-10"
                @click.stop="friendships.cancelFriendRequest(friend.id)"
              >
                <span class="text-white text-sm">×</span>
              </div>
              <div class="w-16 h-16 rounded-full bg-gray-light flex items-center justify-center mb-1">
                <span class="text-sm text-white text-center">{{ friend.name }}</span>
              </div>
            </div>

            <!-- Incoming Requests -->
            <div
              :data-request-id="friend.id"
              v-for="friend in incomingRequests"
              :key="friend.id"
              class="flex flex-col items-center cursor-pointer flex-shrink-0 relative"
            >
              <div
                class="absolute left-1/2 -translate-x-1/2 -top-3 z-10 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center cursor-pointer"
                @click.stop="friendships.acceptFriendRequest(friend.id)"
              >
                <span class="text-white text-sm">✓</span>
              </div>
              <div
                class="absolute left-1/2 -translate-x-1/2 -bottom-3 z-10 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center cursor-pointer"
                @click.stop="friendships.rejectFriendRequest(friend.id)"
              >
                <span class="text-white text-sm">×</span>
              </div>

              <div class="w-16 h-16 rounded-full bg-gray-light flex items-center justify-center mb-1">
                <span class="text-sm text-white text-center">{{ friend.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue"
import { mainStore } from "../stores/store"
import { friendships, transmissions } from "../lib/methods"
const store = mainStore()

const acceptedFriends = computed(() => store.friends.filter((f) => f.status === "accepted"))

const outgoingRequests = computed(() => store.friends.filter((f) => f.status === "pending" && f.sender_id === store.user.id))

const incomingRequests = computed(() => store.friends.filter((f) => f.status === "pending" && f.sender_id !== store.user.id))

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
