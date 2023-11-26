const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { uuid } = require('uuidv4');

const dynamoDBClient = new DynamoDBClient({ region: "ap-southeast-1" }); // Replace with your AWS region
const tableName = 'AssignmentPhoto'; // Replace with your DynamoDB table name

const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

exports.handler = async (event) => {
  // Extract information about the uploaded file
  const bucketName = event.Records[0].s3.bucket.name;
  const fileName = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  const fileSize = event.Records[0].s3.object.size;
  const ownerId = event.Records[0].s3.bucket.ownerIdentity.principalId;

  // Create a record to insert into DynamoDB
  const item = {
    TableName: tableName,
    Item: {
      'photoID': uuid(),
      'FileName': fileName,
      'Bucket': bucketName,
      'FileSize': fileSize,
      "OwnerId": ownerId
    }
  };

  try {
    const command = new PutCommand(item);
    const response = await docClient.send(command);
    console.log('File metadata inserted into DynamoDB');
    return { statusCode: 200, body: 'Successfully processed S3 event', response: response };
  } catch (error) {
    console.error('Error inserting file metadata into DynamoDB:', error);
    throw error;
  }
};
