import { Client } from 'appwrite';

const client = new Client();

client.setEndpoint(process.env.REACT_APP_API_ENDPOINT).setProject(process.env.REACT_APP_PROJECT_ID);

export default client;

