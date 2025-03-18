import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';
const USERNAME = 'admin1';
const PASSWORD = 'admin123';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`,
  },
});

export interface Organization {
  name: string;
}

export interface User {
  id: number;
  name: string;
}
export const fetchOrganizationTables = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get('/organization/tables');
    return response.data; // e.g. ["org_sales", "org_marketing"]
  } catch (error) {
    console.error('❌ Error fetching org tables:', error);
    return [];
  }
};

export const createOrganizationTable = async (organizationName: string): Promise<boolean> => {
  try {
    await apiClient.post('/add/table', organizationName);
    return true;
  } catch (error) {
    console.error('❌ Error creating table:', error);
    return false;
  }
};

export const fetchUsersByOrganization = async (orgTableName: string): Promise<User[]> => {
  try {
    const response = await apiClient.get(`/users/${orgTableName}`);

    console.log("✅ API Raw Response:", response.data[0].id);

    if (!Array.isArray(response.data)) {
      console.error("❌ Response is not an array:", response.data);
      return [];
    }

    // ✅ Correct Mapping (Since API already returns { id, name })
    const users: User[] = response.data.map((obj: any) => ({
      id: obj.id,
      name: obj.name,
    }));

    console.log("✅ Transformed Users:", users);
    return users;
  } catch (error) {
    console.error(`❌ Error fetching users from "${orgTableName}":`, error);
    return [];
  }
};

export const insertUserIntoOrganization = async (user: User, orgTableName: string): Promise<User | null> => {
  try {
    const body = {
      id: user.id,
      username: user.name,
      organization: orgTableName.replace(/^org_/, ""),
    };
    const response = await apiClient.post('/insertuser', body);


    const returnedData = response.data;
    if (!returnedData) {
      return null;
    }
    return {
      id: returnedData.id,
      name: returnedData.username,
    };
  } catch (error) {
    console.error(`❌ Error inserting user into ${orgTableName}:`, error);
    return null;
  }
};
