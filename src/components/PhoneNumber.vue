<template>
  <div class="flex flex-col space-y-1">
    <label for="phone" class="text-gray-superlight text-sm sm:text-base">Phone<span v-if="isUser">*</span></label>
    <div class="flex">
      <select v-model="store.tempUser.phone_prefix" class="w-[130px] rounded-r-none">
        <option v-for="country in sortedCountryCodes" :key="country.code" :value="country.dial_code">{{ country.emoji }} {{ country.dial_code }}</option>
      </select>
      <input type="tel" class="w-full !rounded-l-none !border-l-0" v-model="store.tempUser.phone_number" required />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue"
import { countryCodes } from "@/lib/constants"
import { mainStore } from "@/stores/store"
const store = mainStore()
const sortedCountryCodes = computed(() => [...countryCodes].sort((a, b) => parseInt(a.dial_code.replace("+", "")) - parseInt(b.dial_code.replace("+", ""))))
// isUser prop
const props = defineProps({
  isUser: {
    type: Boolean,
    default: true,
  },
})

onMounted(() => {
  // Set user phone to defaults
  console.log("isUser", props.isUser)
  if (props.isUser === false) {
    store.tempUser.phone_prefix = "+1"
    store.tempUser.phone_number = ""
    store.tempUser.phone_combined = ""
  }
})

// on unmount
onUnmounted(() => {
  if (props.isUser === false) {
    store.tempUser.phone_prefix = store.user.phone_prefix
    store.tempUser.phone_number = store.user.phone_number
    store.tempUser.phone_combined = store.user.phone_combined
  }
})
</script>
