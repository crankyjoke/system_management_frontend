import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';
const USERNAME = 'admin1';
const PASSWORD = 'admin123';

// 🔹 Axios Instance with Basic Auth
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`,
  },
});

export interface Organization {
  name: string; // store "myorg" not "org_myorg"
}

export interface User {
  id: number;
  name: string;
}

// 1) Fetch "org_*" tables from the backend
export const fetchOrganizationTables = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get('/organization/tables');
    return response.data; // e.g. ["org_sales", "org_marketing"]
  } catch (error) {
    console.error('❌ Error fetching org tables:', error);
    return [];
  }
};

// 2) Create a new organization table by sending the "clean" name (no "org_")
export const createOrganizationTable = async (organizationName: string): Promise<boolean> => {
  try {
    await apiClient.post('/add/table', organizationName);
    return true;
  } catch (error) {
    console.error('❌ Error creating table:', error);
    return false;
  }
};

// 3) Fetch users from a fully prefixed name ("org_sales")
export const fetchUsersByOrganization = async (orgTableName: string): Promise<User[]> => {
  try {
    const response = await apiClient.get(`/users/${orgTableName}`);

    console.log("✅ API Raw Response:", response.data[0].id); // Check if this logs correctly

    if (!Array.isArray(response.data)) {
      console.error("❌ Response is not an array:", response.data);
      return [];
    }

    // ✅ Correct Mapping (Since API already returns { id, name })
    const users: User[] = response.data.map((obj: any) => ({
      id: obj.id,   // Ensure it matches "id" from backend
      name: obj.name, // Ensure it matches "name" from backend
    }));

    console.log("✅ Transformed Users:", users);
    return users;
  } catch (error) {
    console.error(`❌ Error fetching users from "${orgTableName}":`, error);
    return [];
  }
};

// 4) Insert user {id, name} into the fully prefixed table "org_sales"
export const insertUserIntoOrganization = async (user: User, orgTableName: string): Promise<User | null> => {
  try {
    // The backend expects { id, username, organization }
    const body = {
      id: user.id,
      username: user.name,
      // We send only the base name (no "org_") so the backend can prefix if needed:
      organization: orgTableName.replace(/^org_/, ""),
    };
    const response = await apiClient.post('/insertuser', body);

    // Suppose the backend returns the final object as:
    // { "id": 2, "username": "bob", "organization": "someorg" }
    const returnedData = response.data;
    if (!returnedData) {
      return null;
    }

    // Convert "username" -> "name" to match your "User" interface
    return {
      id: returnedData.id,
      name: returnedData.username,
    };
  } catch (error) {
    console.error(`❌ Error inserting user into ${orgTableName}:`, error);
    return null;
  }
};
