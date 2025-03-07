import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const USERNAME = 'admin1';
const PASSWORD = 'admin123';

export const fetchUsers = async () => {
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



export const addUser = async (user) => {
  try {
    const response = await axios.post(`${BASE_URL}/createUser`, user, {
      headers: {
        Authorization: `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error adding user:', error);
    return null;
  }
};


export const updateUser = async (id, user) => {
  try {
    const response = await axios.put(`${BASE_URL}/update/${id}`, user, {
      headers: {
        Authorization: `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error updating user:', error);
    return null;
  }
};


export const deleteUser = async (id: number) => {
  try {
    const response = await axios.delete(`${BASE_URL}/delete/${id}`, {
      headers: {
        Authorization: `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`
      }
    });
    console.log(response);
    if(response.data === false){
      return false;
    }
    return true;
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    return false;
  }
};


export const updateUserPermissions = async (id, permissions) => {
  try {
    const response = await axios.put(`${BASE_URL}/users/${id}/permissions`, { permissions });
    return response.data;
  } catch (error) {
    console.error('❌ Error updating user permissions:', error);
    return null;
  }
};
