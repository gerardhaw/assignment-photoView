# Photo Upload Web Application

This repository contains the source code for a photo upload web application hosted as a static website on AWS S3, with backend services powered by AWS Lambda.

## Contents

- `index.html`: The main page of the web application, which is hosted on an S3 bucket as a static website.
- `jquery.min.js`: Minified jQuery library used for DOM manipulation and AJAX requests.
- `jwtdecode.js`: Utility to decode JSON Web Tokens (JWT) used for authentication purposes.
- `amazon-cognito-identity.min.js`: Amazon Cognito Identity SDK for JavaScript, enabling authentication with AWS Cognito services.

## Lambda Functions

The repository includes several directories, each containing the source code for AWS Lambda functions:

- `dynamodb-getData-Lambda`: Function to retrieve data from a DynamoDB table.
- `dynamodb-insertData-lambda`: Function to insert data into a DynamoDB table.
- `s3-download-presigned-url-lambda`: Function to generate presigned URLs for downloading objects from S3.
- `s3-get-metadata-lambda`: Function to retrieve metadata for objects stored in S3.
- `s3-upload-presigned-url-lambda`: Function to generate presigned URLs for uploading objects to S3.

To deploy these Lambda functions, compress the contents of each folder into a `.zip` file and upload it to the corresponding Lambda function in the AWS Management Console.

## Deployment

1. **S3 Static Website Hosting**: 
   - Upload `index.html` to your S3 bucket configured for static website hosting.
   - Ensure the bucket policy allows public read access to `index.html`.

2. **Lambda Functions**: 
   - For each Lambda function directory:
     - Compress the folder's contents into a `.zip` file.
     - Upload the `.zip` file to the corresponding Lambda function in the AWS Management Console.

3. **External Libraries**: 
   - Include `jquery.min.js`, `jwtdecode.js`, and `amazon-cognito-identity.min.js` in your S3 bucket along with `index.html` or reference them from a CDN in your HTML file.

## Configuration

Make sure to update the configuration settings in your `index.html` and Lambda functions to match your AWS environment specifics, such as bucket names, region, and Cognito User Pool IDs.

## Contact

For more information or assistance with the deployment process, please contact [Your Contact Information].