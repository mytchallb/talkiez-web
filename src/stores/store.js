import { ref } from 'vue'
import { defineStore } from 'pinia'
  
export const mainStore = defineStore('main', {
  state: () => ({
  /*
  user: {
    "id": 4,
    "name": "Mytch",
    "email": "mytchall.bransgrove@gmail.com",
    "email_verified_at": null,
    "created_at": "2025-01-03T02:37:44.000000Z",
    "updated_at": "2025-01-03T02:55:20.000000Z",
    "friends": "3",
    "friend_requests": null
  }
  friends: {
    id: number
    name: string
  }
  */
  screen: ref('login'),
  token: ref(''),
  user: ref(null),
  friends: ref([]),
  selectedContact: ref(null),
  modals: {
    addFriend: false
  },
  transmissions: ref([]),
  })
})