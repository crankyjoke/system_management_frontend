

import axios from 'axios';
const BASE_URL = 'http://localhost:8080/api/userPosition';
const USERNAME = 'admin1';
const PASSWORD = 'admin123'

export const fetchUserPositions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getall`, {
      headers: {
        Authorization: `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`
      }
    });

    console.log('📡 API Response:', response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return [];
  }

};
export const addUserPosition = async (userposition) => {
  try {
    const response = await axios.put(`${BASE_URL}/createUserPosition`, userposition, {
      headers: {
        Authorization: `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error adding user:', error);
    return null;
  }
}

export const updateUserPosition = async (userposition) => {
  try {
    const response = await axios.put(`${BASE_URL}/updateUserPosition`, userposition, {
      headers: {
        Authorization: `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error adding user:', error);
    return null;
  }
}
