const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { jwtDecode } = require('jwt-decode');

const dynamoDBClient = new DynamoDBClient({ region: "ap-southeast-1" }); // Replace with your AWS region
const tableName = 'AssignmentPhoto'; // Replace with your DynamoDB table name

const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

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
    try {
        // Token is passed in the event.
        const { token } = JSON.parse(event.body);

        let validToken = false;
        if (token) {
            validToken = isValidToken(token); // Implement this function based on token validation logic
        }

        console.log("Valid token? : ",validToken);

        const params = {
            TableName: tableName,
            FilterExpression: validToken ? undefined : "begins_with(FileName, :fp)",
            ExpressionAttributeValues: validToken ? undefined : {":fp": "images/public-read/"}
        };

        const command = new ScanCommand(params);
        const data = await dynamoDBClient.send(command);

        return {
            statusCode: 200,
            body: JSON.stringify(data.Items),
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error fetching data' }),
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
};
