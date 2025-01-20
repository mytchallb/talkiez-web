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
const isRecording = ref(false)
const MAX_DURATION = 30
const remainingTime = ref(MAX_DURATION)
const recordingTimer = ref(null)
const hasPermission = ref(null)

onMounted(async () => {
  try {
    // Check if we already have permission
    const permissionStatus = await navigator.permissions.query({ name: "microphone" })
    hasPermission.value = permissionStatus.state === "granted"

    // Listen for permission changes
    permissionStatus.addEventListener("change", () => {
      hasPermission.value = permissionStatus.state === "granted"
    })

    recorder.value = new AudioRecorder()
    await recorder.value.init()
    recorder.value.isInitialized = true
  } catch (err) {
    console.error("Error checking microphone permission:", err)
    hasPermission.value = false
  }
})

// Computed properties for better state management
const canRecord = computed(() => store.selectedContact && recorder.value?.isInitialized && hasPermission.value)
const buttonClasses = computed(() => ({
  "bg-red-500": isRecording.value,
  "bg-gray-light text-white cursor-not-allowed": !canRecord.value,
  "bg-primary text-black": !isRecording.value && canRecord.value,
}))

const buttonMessage = computed(() => {
  // See if we have friends
  if (store.user?.friends?.length === 0) return "Invite a friend to start"
  if (!store.selectedContact) return "Choose someone to talk to"
  if (!hasPermission.value) return "Microphone access needed - Click for instructions"
  if (!recorder.value?.isInitialized) return "Initializing..."
  if (isRecording.value) return remainingTime.value
  return "Hold to Speak"
})

const startRecording = async () => {
  if (!canRecord.value || isRecording.value) {
    // If we don't have permission, try to get it
    if (!hasPermission.value) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        hasPermission.value = true
      } catch (err) {
        console.error("Error requesting microphone permission:", err)
        // Show instructions for enabling microphone access
        alert(
          "To enable microphone access:\n" +
            "1. Click the camera/microphone icon in your address bar\n" +
            "2. Select 'Always allow' for microphone\n" +
            "3. Refresh the page",
        )
      }
    }
    return
  }

  isRecording.value = true
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
}

const stopRecording = async () => {
  if (!isRecording.value) return

  isRecording.value = false
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

  // Reinitialize recorder for next recording
  await recorder.value.init()
}

onUnmounted(() => {
  document.removeEventListener("mouseup", stopRecording)
  document.removeEventListener("touchend", stopRecording)
  clearInterval(recordingTimer.value)
})
</script>
