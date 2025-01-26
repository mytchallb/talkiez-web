<template>
  <div class="flex flex-col items-center w-full h-full">
    <Nav />
    <Recorder />
    <Friends />
  </div>
</template>

<script setup>
import Nav from "@/components/Nav.vue"
import Friends from "@/components/Friends.vue"
import Recorder from "@/components/Recorder.vue"
</script>
