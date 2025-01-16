<template>
<!-- Recording Button -->
<div 
      class="w-52 h-52 rounded-full flex items-center justify-center text-black cursor-pointer select-none m-auto"
      :class="{
      'bg-red-500': isRecording,
      'bg-primary': !isRecording && store.selectedContact,
      'bg-primary cursor-not-allowed': !store.selectedContact
    }"
    @mousedown="startRecording"
    >
      {{ isRecording ? remainingTime : 'Hold to Speak' }}
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { mainStore } from '../stores/store';
import { transmissions } from '../lib/methods';
import { AudioRecorder } from '../lib/audio';

const store = mainStore();
const recorder = ref(null);
const isRecording = ref(false);
const MAX_DURATION = 30;
const remainingTime = ref(MAX_DURATION);
const recordingTimer = ref(null);

onMounted(async () => {
  recorder.value = new AudioRecorder();
  await recorder.value.init();
});

const startRecording = async () => {
  if (!store.selectedContact || isRecording.value) return;
  
  isRecording.value = true;
  remainingTime.value = MAX_DURATION;
  
  await recorder.value.startRecording();
  document.addEventListener('mouseup', stopRecording);
  
  recordingTimer.value = setInterval(() => {
    remainingTime.value--;
    if (remainingTime.value <= 0) {
      stopRecording();
    }
  }, 1000);
};

const stopRecording = async () => {
  if (!isRecording.value) return;
  
  isRecording.value = false;
  clearInterval(recordingTimer.value);
  document.removeEventListener('mouseup', stopRecording);
  remainingTime.value = MAX_DURATION;

  try {
    const mp3Blob = await recorder.value.stopRecording();
    if (mp3Blob) {
      recorder.value.downloadFile(mp3Blob);
      const result = await transmissions.sendTransmission(mp3Blob, store.selectedContact.id);
      if (result.success) {
        console.log('Audio sent successfully:', result.data);
      } else {
        console.error('Error sending audio:', result.error);
      }
    }
  } catch (err) {
    console.error('Error processing recording:', err);
  }
  
  // Reinitialize recorder for next recording
  await recorder.value.init();
};

onUnmounted(() => {
  document.removeEventListener('mouseup', stopRecording);
  clearInterval(recordingTimer.value);
});
</script>