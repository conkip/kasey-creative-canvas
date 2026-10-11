// utils/s3.js
import {
    S3Client,
    DeleteObjectCommand,
    CopyObjectCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.AWS_REGION;

const S3_BASE_URL = `https://${bucketName}.s3.${region}.amazonaws.com/`;

const S3 = new S3Client({
    region,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

function logS3Failure(operation, context, error) {
    console.error("S3 operation failed", {
        operation,
        ...context,
        errorName: error.name,
        errorMessage: error.message,
        httpStatusCode: error.$metadata?.httpStatusCode,
        requestId: error.$metadata?.requestId,
    });
}

const uploadToS3 = async (fileBuffer, filename, mimeType) => {
    const upload = new Upload({
        client: S3,
        params: {
            Bucket: bucketName,
            Key: filename,
            Body: fileBuffer,
            ContentType: mimeType,
        },
    });

    await upload.done();
    return `${S3_BASE_URL}${filename}`;
};

const deleteFromS3 = async (imageUrlOrFilename) => {
    const filename = extractFilename(imageUrlOrFilename);

    try {
        await S3.send(
            new DeleteObjectCommand({
                Bucket: bucketName,
                Key: filename,
            }),
        );
    } catch (error) {
        logS3Failure("DeleteObject", { key: filename }, error);
        throw error;
    }
};

const copyInS3 = async (sourceFilename, destinationFilename, mimeType) => {
    try {
        await S3.send(
            new CopyObjectCommand({
                Bucket: bucketName,
                CopySource: `${bucketName}/${sourceFilename}`,
                Key: destinationFilename,
                ContentType: mimeType,
                MetadataDirective: "REPLACE",
            }),
        );
    } catch (error) {
        logS3Failure(
            "CopyObject",
            { sourceKey: sourceFilename, destinationKey: destinationFilename },
            error,
        );
        throw error;
    }
    return `${S3_BASE_URL}${destinationFilename}`;
};

const renameInS3 = async (
    oldFilenameOrUrl,
    newFilename,
    mimeType = "image/webp",
) => {
    const oldFilename = extractFilename(oldFilenameOrUrl);

    if (oldFilename === newFilename) {
        return `${S3_BASE_URL}${newFilename}`;
    }

    await copyInS3(oldFilename, newFilename, mimeType);
    await deleteFromS3(oldFilename);
    return `${S3_BASE_URL}${newFilename}`;
};

//also used in modify-paintings.js
function extractFilename(url) {
    if (!url) return null;

    if (url.includes(".amazonaws.com/")) {
        return url.split(".amazonaws.com/")[1].split("?")[0];
    }

    return url;
}

export default { uploadToS3, deleteFromS3, renameInS3, S3_BASE_URL };
