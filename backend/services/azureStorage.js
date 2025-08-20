import { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

class AzureStorageService {
  constructor() {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    );
    this.containerName =
      process.env.AZURE_STORAGE_CONTAINER_NAME || "submissions";
  }

  async createContainerIfNotExists() {
    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName
    );
    const exists = await containerClient.exists();
    if (!exists) {
      await containerClient.create();
      console.log(`Container ${this.containerName} created`);
    }
  }

  async uploadFile(fileBuffer, fileName, mimeType, folder = "submissions") {
    try {
      await this.createContainerIfNotExists();

      const blobName = `${folder}/${uuidv4()}-${fileName}`;
      const blockBlobClient = this.blobServiceClient
        .getContainerClient(this.containerName)
        .getBlockBlobClient(blobName);

      await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
        blobHTTPHeaders: { blobContentType: mimeType },
      });

      return {
        blobName,
        url: blockBlobClient.url,
        size: fileBuffer.length,
      };
    } catch (error) {
      console.error("Error uploading file to Azure:", error);
      throw error;
    }
  }

  async generateSASUrl(blobName, permissions = "r", expiryHours = 24) {
    try {
      const sasToken = generateBlobSASQueryParameters(
        {
          containerName: this.containerName,
          blobName: blobName,
          permissions: BlobSASPermissions.parse(permissions),
          startsOn: new Date(),
          expiresOn: new Date(
            new Date().valueOf() + expiryHours * 60 * 60 * 1000
          ),
        },
        this.blobServiceClient.credential
      );

      return `${this.blobServiceClient.url}${this.containerName}/${blobName}?${sasToken}`;
    } catch (error) {
      console.error("Error generating SAS URL:", error);
      throw error;
    }
  }

  async deleteFile(blobName) {
    try {
      const blockBlobClient = this.blobServiceClient
        .getContainerClient(this.containerName)
        .getBlockBlobClient(blobName);

      await blockBlobClient.delete();
      return true;
    } catch (error) {
      console.error("Error deleting file from Azure:", error);
      throw error;
    }
  }

  async listFiles(prefix = "") {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(
        this.containerName
      );
      const blobs = [];

      for await (const blob of containerClient.listBlobsFlat({ prefix })) {
        blobs.push({
          name: blob.name,
          url: `${containerClient.url}/${blob.name}`,
          size: blob.properties.contentLength,
          lastModified: blob.properties.lastModified,
        });
      }

      return blobs;
    } catch (error) {
      console.error("Error listing files from Azure:", error);
      throw error;
    }
  }
}

// ✅ ESM export
export default new AzureStorageService();
