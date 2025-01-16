<template>
  <div class="flex flex-col items-center min-h-screen" >
    <Nav />
    <Recorder />
    <Friends />
  </div>
</template>

<script setup>
import { ref, onUnmounted, onMounted } from 'vue'
import { getLoggedInUserDetails, getUserFriends, transmissions } from '../../lib/methods'
import Nav from '@/components/Nav.vue'
import Friends from '@/components/Friends.vue'
import Recorder from '@/components/Recorder.vue'

onMounted(async () => {
  await getLoggedInUserDetails();
  await getUserFriends();
  await transmissions.getTransmissions();
})

</script>