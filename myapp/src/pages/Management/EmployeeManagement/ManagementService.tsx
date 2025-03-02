import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const USERNAME = 'admin1';
const PASSWORD = 'admin123';

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getall`, {
      headers: {
        Authorization: `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}` // ✅ Encode credentials in Base64
      }
    });

    console.log('📡 API Response:', response.data); // ✅ Log API response
    return Array.isArray(response.data) ? response.data : []; // ✅ Ensure it returns an array
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return [];
  }
};


// ✅ Add a new user
export const addUser = async (user) => {
  try {
    const response = await axios.post(`${BASE_URL}/createUser`, user, {
      headers: {
        Authorization: `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}` // ✅ Encode credentials in Base64
      }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error adding user:', error);
    return null;
  }
};

// ✅ Update a user's details
export const updateUser = async (id, user) => {
  try {
    const response = await axios.put(`${BASE_URL}/update/${id}`, user, {
      headers: {
        Authorization: `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}` // ✅ Encode credentials in Base64
      }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error updating user:', error);
    return null;
  }
};

// ✅ Delete a user
export const deleteUser = async (id: number) => {
  try {
    const response = await axios.delete(`${BASE_URL}/delete/${id}`, {
      headers: {
        Authorization: `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}` // ✅ Encode credentials in Base64
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

// ✅ Update a user's permissions
export const updateUserPermissions = async (id, permissions) => {
  try {
    const response = await axios.put(`${BASE_URL}/users/${id}/permissions`, { permissions });
    return response.data;
  } catch (error) {
    console.error('❌ Error updating user permissions:', error);
    return null;
  }
};
