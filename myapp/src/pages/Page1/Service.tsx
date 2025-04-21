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

export const addtimeTable = async (rawData:string): Promise<boolean> => {
  try{
    const response = await apiClient.post('/copycourses',rawData);
    return true;
  }
  catch(error){
    console.error(error);
    return false;
  }
}
