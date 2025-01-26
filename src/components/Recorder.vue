<template>
  <div class="flex justify-center items-center flex-1">
    <div
      class="w-52 h-52 p-4 rounded-full flex items-center justify-center text-black cursor-pointer select-none m-auto"
      :class="buttonClasses"
      @mousedown="startRecording"
      @touchstart.prevent="startRecording"
    >
      <span class="font-bold text-center pointer-events-none user-select-none">{{ buttonMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue"
import { mainStore } from "../stores/store"
import { transmissions } from "../lib/methods"
import { AudioRecorder } from "../lib/audio"

const store = mainStore()
const recorder = ref(null)
const MAX_DURATION = 30
const remainingTime = ref(MAX_DURATION)
const recordingTimer = ref(null)
const hasPermission = ref(null)

onMounted(() => {
  // Simplified - just create the recorder instance
  recorder.value = new AudioRecorder()
  recorder.value.isInitialized = true
})

// Computed properties for better state management
const canRecord = computed(() => store.selectedContact && recorder.value?.isInitialized)
const buttonClasses = computed(() => ({
  "bg-red-500": store.isRecording,
  "bg-gray-light text-white cursor-not-allowed": !canRecord.value,
  "bg-primary text-black": !store.isRecording && canRecord.value,
}))

const buttonMessage = computed(() => {
  // See if we have friends
  if (store.user?.friends?.length === 0) return "Invite a friend to start"
  if (!store.selectedContact) return "Choose someone to talk to"
  if (!recorder.value?.isInitialized) return "Initializing..."
  if (store.isRecording) return remainingTime.value
  return "Hold to Speak"
})

const startRecording = async () => {
  if (!canRecord.value || store.isRecording) return

  // Check/request microphone permission when user tries to record
  try {
    // First check if we already have permission
    if (!store.micPermissionGranted) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // If we get here, permission was granted
      stream.getTracks().forEach((track) => track.stop()) // Clean up the stream
      store.micPermissionGranted = true
      // Return early - user needs to press button again
      return
    }

    // If we have permission, start recording
    store.isRecording = true
    remainingTime.value = MAX_DURATION

    await recorder.value.startRecording()
    document.addEventListener("mouseup", stopRecording)
    document.addEventListener("touchend", stopRecording)

    recordingTimer.value = setInterval(() => {
      remainingTime.value--
      if (remainingTime.value <= 0) {
        stopRecording()
      }
    }, 1000)
  } catch (err) {
    console.error("Error requesting microphone permission:", err)
    alert(
      "To enable microphone access:\n" +
        "1. Click the camera/microphone icon in your address bar\n" +
        "2. Select 'Always allow' for microphone\n" +
        "3. Refresh the page",
    )
  }
}

const stopRecording = async () => {
  if (!store.isRecording) return

  store.isRecording = false
  clearInterval(recordingTimer.value)
  document.removeEventListener("mouseup", stopRecording)
  document.removeEventListener("touchend", stopRecording)
  remainingTime.value = MAX_DURATION

  try {
    const mp3Blob = await recorder.value.stopRecording()
    if (mp3Blob) {
      // recorder.value.downloadFile(mp3Blob)
      console.log("sending to ", store.selectedContact.friend_user_id)
      const result = await transmissions.sendTransmission(mp3Blob, store.selectedContact.friend_user_id)
      if (result.success) {
        console.log("Audio sent successfully:", result.data)
      } else {
        console.error("Error sending audio:", result.error)
      }
    }
  } catch (err) {
    console.error("Error processing recording:", err)
  }
}

onUnmounted(() => {
  document.removeEventListener("mouseup", stopRecording)
  document.removeEventListener("touchend", stopRecording)
  clearInterval(recordingTimer.value)
})
</script>
