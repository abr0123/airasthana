import { outputContainerClient } from "./connection";

export async function fileUploader(folderName: string, fileName: string, data: any) {
    const blobName = `${folderName}/${fileName}`;
    const blockBlobClient = outputContainerClient.getBlockBlobClient(blobName);

    const uploadBlobResponse = await blockBlobClient.upload(data, Buffer.byteLength(data));
    //console.log(`Uploaded block blob ${blobName} successfully`, uploadBlobResponse.requestId);
}
