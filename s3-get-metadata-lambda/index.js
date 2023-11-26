const { S3Client, HeadObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = new S3Client({ region: "ap-southeast-1" }); 
const bucketName = 'assignment-photo-bucket';

// Function to retrieve user metadata from the S3 object
async function getUserMetadata(bucket, key) {
    const command = new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
    });

    try {
        const response = await s3Client.send(command);
        const username = response.Metadata['username']; // Metadata keys are returned in lowercase
        return username;
    } catch (error) {
        console.error("Error fetching object metadata:", error);
        throw error;
    }
}

exports.handler = async (event) => {

    const { objKey } = JSON.parse(event.body);

    try {
        const username = await getUserMetadata(bucketName, objKey);
        console.log("Username:", username);
        return {
            statusCode: 200,
            body: JSON.stringify({ Username: username })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error fetching metadata" })
        };
    }
};
