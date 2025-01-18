<template>
  <div class="flex flex-col space-y-1">
    <label for="phone" class="text-gray-superlight text-base">Phone</label>
    <div class="flex">
      <select v-model="store.tempUser.phone_prefix" class="w-[130px] rounded-r-none">
        <option v-for="country in sortedCountryCodes" :key="country.code" :value="country.dial_code">{{ country.emoji }} {{ country.dial_code }}</option>
      </select>
      <input type="tel" class="w-full !rounded-l-none !border-l-0" v-model="store.tempUser.phone_number" required />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue"
import { countryCodes } from "@/lib/constants"
import { mainStore } from "@/stores/store"
const store = mainStore()
const sortedCountryCodes = computed(() => [...countryCodes].sort((a, b) => parseInt(a.dial_code.replace("+", "")) - parseInt(b.dial_code.replace("+", ""))))

onMounted(() => {})

// watch([phoneCountry, phone], ([newPrefix, newPhone]) => {
//   store.tempUser.phone_prefix = newPrefix
//   store.tempUser.phone = newPrefix + newPhone
// })
</script>
