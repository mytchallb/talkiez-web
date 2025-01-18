import { ref } from "vue"
import { defineStore } from "pinia"

export const mainStore = defineStore("main", {
  state: () => ({
    screen: ref("login"),
    token: ref(""),
    user: ref({
      name: "Mytch",
      phone_combined: "+1",
      phone_prefix: "+1",
      email: "mytchall.bransgrove@gmail.com",
      password: "admin",
      language: "en",
    }),
    tempUser: ref({
      name: "Mytch",
      phone_combined: "+1",
      phone_prefix: "+1",
      email: "mytchall.bransgrove@gmail.com",
      password: "admin",
      language: "en",
    }),
    api: "http://talkiez-api.test/api",
    friends: ref([]),
    selectedContact: ref(null),
    modals: {
      addFriend: false,
    },
    transmissions: ref([]),
  }),
  actions: {
    setUserFromTempUser() {
      this.user = this.tempUser
    },
  },
  persist: true,
})
