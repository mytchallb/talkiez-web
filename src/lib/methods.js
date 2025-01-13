import { apiPost, apiGet } from './utils';
import { mainStore } from '../stores/store';

// Auth
export const auth = {
  async login(email, password) {
    try {
      const response = await apiPost('/auth/login/', { email, password });
      
      if (response.token) {
        mainStore().token = response.token;
        mainStore().screen = 'main';
        return { success: true };
      }
      
      return { 
        success: false, 
        error: response.message || 'Login failed' 
      };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'An unexpected error occurred' 
      };
    }
  },
  async register(name, email, password) {
    try {
      const response = await apiPost('/auth/register/', { name, email, password });
      
      if (response.token) {
        mainStore().token = response.token;
        return { success: true };
      }
      
      if (response.errors) {
        return {
          success: false,
          error: Object.values(response.errors).flat().join(', ')
        };
      }
      
      return { 
        success: false, 
        error: response.message || 'Registration failed' 
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: 'An unexpected error occurred' 
      };
    }
  },
  async logout() {
    const response = await apiPost('/auth/logout/');
    mainStore().token = '';
    mainStore().user = null;
    mainStore().screen = 'login';
  }
};

export const transmissions = {

  
  async sendTransmission(audioBlob, receiverId) {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('receiver_id', receiverId);
      formData.append('origin', 'web');

      const response = await apiPost('/transmissions/send/', formData);
      
      // The response will contain message and transmission data
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Error sending transmission:', error);
      return {
        success: false,
        error: 'Failed to send transmission'
      };
    }
  },
  async getTransmissions() {
    console.log('Getting transmissions');
    const response = await apiGet('/transmissions/');
    console.log(response)
    mainStore().transmissions = response.transmissions;
  },
  async playTransmission(transmission) {
    try {
      console.log('Playing transmission', transmission);

      const audioBlob = await apiPost(
        `/transmissions/listen/`, 
        { transmission_id: transmission.id },
        {},
        'blob'
      );
      
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      // Return a promise that resolves when audio finishes playing
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl); // Clean up the blob URL
          resolve();
        };
        audio.onerror = (error) => {
          URL.revokeObjectURL(audioUrl);
          reject(error);
        };
        audio.play().catch(reject);
      });
    } catch (error) {
      console.error('Error playing transmission:', error);
      throw error;
    }
  }
}

export const getLoggedInUserDetails = async () => {
  const response = await apiGet('/user/');

  // if response.success
  mainStore().user = response;
  return response;
}

export const getUserFriends = async () => {
  const response = await apiGet('/friendships/');
  mainStore().friends = response;
  return response;
}

export const sendFriendRequest = async (phone, email) => {
  const response = await apiPost('/friendships/request', { phone, email });
  await getUserFriends();
  return response;
}

export const acceptFriendRequest = async (friendId) => {
  const response = await apiPost('/friendships/accept', { friend_id: friendId });
  await getUserFriends();
  return response;
}

export const cancelFriendRequest = async (friendId) => {
  const response = await apiPost('/friendships/cancel', { friend_id: friendId });
  await getUserFriends();
  return response;
}

export const rejectFriendRequest = async (friendId) => {
  const response = await apiPost('/friendships/reject', { friend_id: friendId });
  await getUserFriends();
  return response;
}