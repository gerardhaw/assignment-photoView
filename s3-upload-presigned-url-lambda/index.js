const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { jwtDecode } = require('jwt-decode');

const s3Client = new S3Client({ region: "ap-southeast-1" }); // Replace with your region
const bucketName = 'assignment-photo-bucket'; // Replace with your actual bucket name

function isValidToken(token) {
    try {
        console.log("Token : ", token);
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        console.log("CurrentTime : ,", currentTime);
        console.log("decoded exp : ", decoded.exp);

        // Check if token is expired
        if (decoded.exp < currentTime) {
            console.error('Token is expired');
            return false;
        }

        return true;

    } catch (error) {
        console.error('Error decoding token:', error);
        return false;
    }
}

exports.handler = async (event) => {
    
  const { fileName, fileType, publicView, userName, token } = JSON.parse(event.body);

  // Validate the token first
  if (!isValidToken(token)) {
    return {
        statusCode: 401, // Unauthorized
        body: JSON.stringify({ error: 'Invalid or expired token' }),
        headers: {
            'Content-Type': 'application/json'
        }
    };
  }

  const objKey = `images/${publicView}/${fileName}`; // Construct the object key using the private or public-read folder

  const s3Params = {
    Bucket: bucketName,
    Key: objKey,
    ContentType: fileType,
    ACL: publicView, // 'private' or 'public-read' if the file should be publicly accessible
    Metadata: {
      'username': userName // Adding username as metadata
    } 
  };

  try {
    const command = new PutObjectCommand(s3Params);
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 }); // Expires in 60 seconds

    return {
      statusCode: 200,
      body: JSON.stringify({ presignedUrl }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } catch (error) {
    console.error('Error getting presigned URL:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error creating presigned URL' })
    };
  }
};
