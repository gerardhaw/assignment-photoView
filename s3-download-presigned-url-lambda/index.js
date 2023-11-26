const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
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
    
  const { objKey, token } = JSON.parse(event.body);

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

  const s3Params = {
    Bucket: bucketName,
    Key: objKey
  }

  try {
    const command = new GetObjectCommand(s3Params);
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour

    return {
      statusCode: 200,
      body: JSON.stringify({ presignedUrl }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error generating presigned URL' })
    };
  }
};
