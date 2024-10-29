> # **PollyBlogs: Text-to-Speech Blog Narration Application**

> ## **Overview**
> PollyBlogs is a powerful text-to-speech application that uses AWS Polly to generate voice narration for blog posts. It efficiently stores the generated audio files in an S3 bucket and checks for redundancy by determining whether an audio file already exists for a specific blog before generating it.

> ## **Key features:**
> - 🔊 Text-to-Speech Conversion: Converts blog text into audio using various Polly voices (Joanna, Matthew, Ivy, etc.).
> - 📦 S3 Storage: Uploads and stores audio files in Amazon S3 and retrieves them without duplicating existing files.
> - 🔐 Secure Access: Features JWT-based authentication to ensure user security for creating and accessing blogs.
> - 📝 Save and Replay Blogs: Users can save blogs, retrieve previously saved content, and replay the generated audio.
> - 🚀 Efficient Caching: Avoids regenerating audio if the same text with the same voice combination exists in S3.

> ## **System Architecture:**
![Architectural-design](https://github.com/user-attachments/assets/c5d3cd93-71ac-4010-8370-d08b0e70931c)

> ## **Tech Stack Used**
> - **Frontend:** React.Js
> - **Backend:** AWS Lambda (Node.js), Serverless Framework
> - **Cloud Services:**
> - Amazon Polly: Text-to-speech
> - Amazon S3: File storage for audio files
> - Amazon DynamoDB: Database for user data and saved blogs
> - **Authentication:** JWT-based authentication
> - **Deployment:** AWS Lambda and S3

> ## **Project Structure**
```
|-- frontend/
|-- backend/
 |-- authService/
 |-- blogService/
 |-- speechService/
 |-- layers/
 |-- serverless.yml

```

> ## **Prerequisites**
> - **AWS Account:** An active AWS account with IAM roles for S3, DynamoDB, Polly, and Lambda.
> - **Node.js:** Ensure you have Node.js installed (version 16 or higher).
> - **Serverless Framework:** Install globally using npm install -g serverless.
> - **AWS CLI:** Configure AWS CLI for deployment.

> ## **Setup Instructions**
> ### 1. Clone the Repository
> First, clone the project repository to your local machine.  
```
git clone https://github.com/your-username/pollyblogs.git
cd pollyblogs
```
> ### 2. Install Serverless Framework & Dependencies
> Move into each service's directory and install the necessary dependencies:
```
npm install -g serverless //it will create serverless.yml file in your backend directory
cd authService
npm install
```
> * Repeat this for other services like blogService, speechService.
> * Navigate to fontend directory:
```
cd frontend
npm install
```


> ### 3. Setup AWS Services
> - **S3 Bucket:** Create a bucket in S3 for storing audio files.
> - **DynamoDB Tables:** Create two DynamoDB tables:
> - Users for user data.
> - SavedBlogs for storing saved blogs.
> - Update the necessary permissions in your IAM role for S3, Polly, and DynamoDB.

> ### 4. Modify Environment Variables
> Update serverless.yml to set your environment variables like JWT_SECRET and S3_BUCKET_NAME.

> yaml:
```
environment:
  JWT_SECRET: 'your-secret-key'
  S3_BUCKET_NAME: 'your-s3-bucket-name'
```

### 5. Deploy to AWS
> Use the Serverless Framework to deploy:
`serverless deploy`
> The terminal output should look like:
```
endpoints:
  POST - https://jpokwv20g2.execute-api.ap-south-1.amazonaws.com/dev/register
  POST - https://jpokwv20g2.execute-api.ap-south-1.amazonaws.com/dev/login
  POST - https://jpokwv20g2.execute-api.ap-south-1.amazonaws.com/dev/api/save-blog
  GET - https://jpokwv20g2.execute-api.ap-south-1.amazonaws.com/dev/api/get-blogs
  GET - https://jpokwv20g2.execute-api.ap-south-1.amazonaws.com/dev/api/get-blog/{blogId}
  DELETE - https://jpokwv20g2.execute-api.ap-south-1.amazonaws.com/dev/api/delete-blog
  POST - https://jpokwv20g2.execute-api.ap-south-1.amazonaws.com/dev/api/speech
functions:
  authService: serverless-microservices-backend-dev-authService (18 kB)
  blogService: serverless-microservices-backend-dev-blogService (18 kB)
  speechService: serverless-microservices-backend-dev-speechService (18 kB)
layers:
  commonLibs: arn:aws:lambda:ap-south-1:905418375464:layer:commonLibs:18
```

### 6. Run the Frontend
> To run the frontend locally:
```
cd frontend
npm run dev
```
# IAM Role Policy Example
> Ensure your AWS IAM role has the following permissions:
```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:GetObjectAttributes",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::bucket-/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "polly:SynthesizeSpeech"
      ],
      "Resource": "your-frontend-url"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Query"
      ],
      "Resource": [
        "arn:aws:dynamodb:ap-south-1:123456789012:table/user-table-name",
        "arn:aws:dynamodb:ap-south-1:123456789012:table/blogs-table-name"
      ]
    }
  ]
}

```

# **Known Issues**
> Ensure that the unique blogId is generated consistently to prevent duplicate uploads in S3.
> Ensure your IAM roles and permissions are properly set up to avoid access issues.

# *Contributors*
_Lakshya Sharma_ – _Developer and Maintainer_
