<template>
  <Modal>
    <template v-if="modalState === 'add'">
      <h1 class="text-2xl font-bold mb-4">Add Friend</h1>
      <p class="text-gray-600 mb-6">Send a friend request to a phone number or email address.</p>
      <div class="flex flex-col gap-4">
        <PhoneNumber :isUser="false" />
        <p class="text-gray-400 text-center">- or -</p>
        <input type="text" v-model="emailRef" placeholder="Email Address" class="p-2 border border-gray-300 rounded-md" />
      </div>
      <div class="flex justify-end gap-4 mt-6">
        <button @click="store.popModal()" class="btn secondary">Cancel</button>
        <button @click="addFriend" class="btn">Add Friend</button>
      </div>
      <div v-if="errorMsg" class="mt-4">
        <p class="!text-red-500 text-center">{{ errorMsg }}</p>
      </div>
    </template>
    <template v-else>
      <div class="text-center">
        <h1 class="text-2xl font-bold mb-4">Success</h1>
        <p class="text-gray-600 mb-6">Friend request sent!</p>
        <button @click="finishModal" class="btn">Ok</button>
      </div>
    </template>
  </Modal>
</template>
<script setup>
import { ref } from "vue"
import { mainStore } from "../../stores/store"
import { friendships } from "@/lib/methods"
import Modal from "@/components/Modal.vue"
import PhoneNumber from "@/components/PhoneNumber.vue"

const store = mainStore()

const emailRef = ref("")
const modalState = ref("add") // add, success
const errorMsg = ref("")

const addFriend = async () => {
  errorMsg.value = ""
  const phone = (store.tempUser.phone_prefix + store.tempUser.phone_number).trim() || ""
  const email = emailRef.value.trim() || ""

  if (!phone && !email) {
    errorMsg.value = "Please enter a phone number or email address."
    return
  }

  try {
    await friendships.sendFriendRequest(phone, email)
    modalState.value = "success"
  } catch (error) {
    if (error.errors && Object.keys(error.errors).length > 0) {
      const messages = Object.values(error.errors).flat().join("\n")
      errorMsg.value = messages
    } else {
      errorMsg.value = error.message || "An error occurred"
    }
  }
}

const finishModal = () => {
  store.popModal()
  modalState.value = "add"
}
</script>
