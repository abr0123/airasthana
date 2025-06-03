import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";


import * as dotenv from "dotenv";
dotenv.config();

const account = process.env.ACCOUNT_NAME || "";
const accountKey = process.env.ACCOUNT_KEY || "";
const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);

export const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    sharedKeyCredential
);

export const outputContainerClient = blobServiceClient.getContainerClient('openai-final');