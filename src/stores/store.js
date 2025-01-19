import { ref } from "vue"
import { defineStore } from "pinia"

export const mainStore = defineStore("main", {
  state: () => ({
    screen: ref("login"),
    token: ref(""),
    user: ref({
      name: "",
      phone_combined: "+1",
      phone_prefix: "+1",
      email: "",
      password: "",
      language: "en",
    }),
    tempUser: ref({
      name: "",
      phone_combined: "+1",
      phone_prefix: "+1",
      email: "",
      password: "",
      language: "en",
    }),
    api: "https://api.talkiez.dev/api",
    friends: ref([]),
    selectedContact: ref(null),
    modals: ref([]),
    transmissions: ref([]),
  }),
  actions: {
    setUserFromTempUser() {
      this.user = ref(structuredClone(this.tempUser.value))
    },
    popModal() {
      this.modals.pop()
    },
    resetState(saveUser = false) {
      // This can happen on login and logout
      const user = structuredClone(this.user?.value || {})
      const api = this.api
      this.$reset()
      this.api = api
      if (saveUser) {
        this.tempUser = user
        this.user = user
      }
    },
  },
  persist: true,
})
