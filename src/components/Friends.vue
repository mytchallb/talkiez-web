<template>
  <!-- Contact List -->
  <div class="w-full mt-auto bg-gray-medium">
    <div class="flex justify-center gap-5 px-5 py-5" @click="store.selectedContact = null">
      <!-- Accepted Friends -->
      <div
        v-for="friend in acceptedFriends"
        :key="friend.request_id"
        :data-id="friend.friend_user_id"
        class="flex flex-col items-center cursor-pointer flex-shrink-0 relative"
        @click.stop="selectContact(friend)"
      >
        <div
          v-if="hasPendingTransmissions(friend.friend_user_id)"
          class="absolute -left-1 -top-1 w-6 h-6 p-1 bg-red-500 rounded-full flex items-center justify-center"
        >
          <svg v-if="isPlaying" class="fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
            <path
              d="M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64l0 384c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352 64 352c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l67.8 0L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"
            />
          </svg>
        </div>

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
              :data-request-id="friend.friend_user_id"
              v-for="friend in outgoingRequests"
              :key="friend.friend_user_id"
              class="flex flex-col items-center cursor-pointer flex-shrink-0 relative"
            >
              <div
                class="absolute left-1/2 -translate-x-1/2 -bottom-3 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center cursor-pointer z-10"
                @click.stop="friendships.cancelFriendRequest(friend.request_id)"
              >
                <span class="text-white text-sm">×</span>
              </div>
              <div class="w-16 h-16 rounded-full bg-gray-light flex items-center justify-center mb-1">
                <span class="text-sm text-white text-center">{{ friend.name }}</span>
              </div>
            </div>

            <!-- Incoming Requests -->
            <div
              :data-request-id="friend.friend_user_id"
              v-for="friend in incomingRequests"
              :key="friend.friend_user_id"
              class="flex flex-col items-center cursor-pointer flex-shrink-0 relative"
            >
              <div
                class="absolute left-1/2 -translate-x-1/2 -top-3 z-10 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center cursor-pointer"
                @click.stop="friendships.acceptFriendRequest(friend.request_id)"
              >
                <span class="text-white text-sm">✓</span>
              </div>
              <div
                class="absolute left-1/2 -translate-x-1/2 -bottom-3 z-10 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center cursor-pointer"
                @click.stop="friendships.rejectFriendRequest(friend.request_id)"
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
import { ref, onMounted, watch } from "vue"
import { mainStore } from "../stores/store"
import { friendships, transmissions } from "../lib/methods"
const store = mainStore()

const acceptedFriends = ref([])
const outgoingRequests = ref([])
const incomingRequests = ref([])
const isPlaying = ref(false)

const updateFriendLists = () => {
  if (!store.friends || !Array.isArray(store.friends)) return

  acceptedFriends.value = store.friends.filter((f) => f.status === "accepted")
  outgoingRequests.value = store.friends.filter((f) => f.status === "pending" && f.sent_by_me)
  incomingRequests.value = store.friends.filter((f) => f.status === "pending" && !f.sent_by_me)
}

onMounted(() => {
  updateFriendLists()
})

// Watch for changes in store.friends
watch(
  () => store.friends,
  (newFriends) => {
    updateFriendLists()
  },
  { deep: true },
)

const hasPendingTransmissions = (friend_user_id) => {
  return store.transmissions.some((t) => t.sender_id === friend_user_id && t.status === "pending")
}

const selectContact = async (friend) => {
  console.log("selectContact", friend)
  if (friend.status === "pending") {
    console.log("Friend has pending transmissions")
    return
  } else {
    console.log("Selecting friend", friend)
  }
  store.selectedContact = friend
  store.modals.addFriend = false

  // Need to play any pending audio transmissions (waiting til each one is finished playing before playing the next one)
  const pendingTransmissions = store.transmissions.filter((t) => t.status === "pending")
  console.log("pendingTransmissions", pendingTransmissions)
  if (pendingTransmissions.length > 0) {
    isPlaying.value = true
    for (const t of pendingTransmissions) {
      await transmissions.playTransmission(t)
      store.transmissions = store.transmissions.filter((trans) => trans.id !== t.id)
    }
    isPlaying.value = false
  }
}
</script>
