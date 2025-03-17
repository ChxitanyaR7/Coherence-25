import { Client, Storage, ID } from "appwrite";

const APPWRITE_PROJECT_ID = process.env.REACT_APP_APPWRITE_PROJECT_ID;
const APPWRITE_BUCKET_ID = process.env.REACT_APP_APPWRITE_BUCKET_ID;
const APPWRITE_ENDPOINT = process.env.REACT_APP_APPWRITE_ENDPOINT

// Initialize Appwrite Client
const client = new Client();
client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);

// Initialize Storage Service
const storage = new Storage(client);

/**
 * Uploads a file to Appwrite Storage.
 * @param {File} file - The file to upload.
 * @returns {Promise<string>} - Returns the uploaded file ID.
 */
export const uploadFile = async (file) => {
  try {
    const response = await storage.createFile(APPWRITE_BUCKET_ID, ID.unique(), file);
    return response.$id; // Return file ID to store in Firebase
  } catch (error) {
    console.error("Error uploading file to Appwrite:", error);
    throw error;
  }
};

/**
 * Generates a public URL for an uploaded Appwrite file.
 * @param {string} fileId - The ID of the stored file.
 * @returns {string} - The public URL to access the file.
 */
export const getFileUrl = (fileId) => {
  return `${APPWRITE_ENDPOINT}/storage/buckets/${APPWRITE_BUCKET_ID}/files/${fileId}/view`;
};

export { client, storage };
