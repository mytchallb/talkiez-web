import { apiPost, apiGet } from "./utils"
import { mainStore } from "../stores/store"

// Auth
export const auth = {
  async alive() {
    try {
      await apiPost("/alive")
      return true
    } catch {
      return false
    }
  },
  async login() {
    try {
      const { email, password } = mainStore().tempUser
      const response = await apiPost("/auth/login", { email, password })

      if (response.token) {
        mainStore().token = response.token
        mainStore().screen = "main"
        mainStore().tempUser.password = ""
        mainStore().setUserFromTempUser()
        return { success: true }
      }

      return {
        success: false,
        error: response.message || "Login failed",
      }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        error: "An unexpected error occurred",
      }
    }
  },
  async register() {
    try {
      const { name, phone_combined, phone_prefix, email, password } = mainStore().tempUser
      const response = await apiPost("/auth/register", { name, phone_combined, phone_prefix, email, password })

      if (response.token) {
        mainStore().token = response.token
        mainStore().tempUser.password = ""
        mainStore().setUserFromTempUser()
        mainStore().screen = "main"
        return { success: true }
      }

      // Handle validation errors from the response
      if (response.data?.errors) {
        return {
          success: false,
          error: Object.values(response.data.errors).flat().join(", "),
        }
      }

      return {
        success: false,
        error: response.message || "Registration failed",
      }
    } catch (error) {
      console.error("Registration error:", error)
      // Handle validation errors from the error object
      if (error.data?.errors) {
        return {
          success: false,
          error: Object.values(error.data.errors).flat().join(" "),
        }
      }
      return {
        success: false,
        error: "An unexpected error occurred",
      }
    }
  },
  async logout() {
    const response = await apiPost("/auth/logout")
    mainStore().token = ""
    mainStore().user = null
    mainStore().screen = "login"
  },
}

export const transmissions = {
  async sendTransmission(audioBlob, receiverId) {
    try {
      const formData = new FormData()
      formData.append("audio", audioBlob)
      formData.append("receiver_id", receiverId)
      formData.append("origin", "web")

      const response = await apiPost("/transmissions/send", formData)

      // The response will contain message and transmission data
      return {
        success: true,
        data: response,
      }
    } catch (error) {
      console.error("Error sending transmission:", error)
      return {
        success: false,
        error: "Failed to send transmission",
      }
    }
  },
  async getTransmissions() {
    console.log("Getting transmissions")
    const response = await apiGet("/transmissions")
    console.log(response)
    mainStore().transmissions = response.transmissions
  },
  async playTransmission(transmission) {
    try {
      console.log("Playing transmission", transmission)

      const audioBlob = await apiPost(`/transmissions/listen/`, { transmission_id: transmission.id }, {}, "blob")

      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)

      // Return a promise that resolves when audio finishes playing
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl) // Clean up the blob URL
          resolve()
        }
        audio.onerror = (error) => {
          URL.revokeObjectURL(audioUrl)
          reject(error)
        }
        audio.play().catch(reject)
      })
    } catch (error) {
      console.error("Error playing transmission:", error)
      throw error
    }
  },
}

export const user = {
  async updateProfile() {
    // Combine phone number before sending
    const userData = { ...mainStore().tempUser }
    if (userData.phone_prefix && userData.phone_number) {
      userData.phone_combined = userData.phone_prefix + userData.phone_number
    }

    const response = await apiPost("/user/update", userData)
    mainStore().user = response
    mainStore().tempUser = response
    return response
  },
  async deleteAccount() {
    const response = await apiPost("/user/delete")
    mainStore().user = null
    mainStore().tempUser = null
    mainStore().token = ""
    mainStore().screen = "login"
    return response
  },
  async getUser() {
    const response = await apiGet("/user")
    console.log("getUser response as", response)
    mainStore().user = response
    mainStore().tempUser = response
    return response
  },
}

export const friendships = {
  async getUserFriends() {
    const response = await apiGet("/friendships")
    mainStore().friends = response
    return response
  },
  async sendFriendRequest(phone, email) {
    const response = await apiPost("/friendships/request", { phone, email })
    await friendships.getUserFriends()
    return response
  },
  async acceptFriendRequest(request_id) {
    const response = await apiPost("/friendships/accept", { request_id })
    await friendships.getUserFriends()
    return response
  },
  async cancelFriendRequest(request_id) {
    const response = await apiPost("/friendships/cancel", { request_id })
    await friendships.getUserFriends()
    return response
  },
  async rejectFriendRequest(request_id) {
    const response = await apiPost("/friendships/reject", { request_id })
    await friendships.getUserFriends()
    return response
  },
}
