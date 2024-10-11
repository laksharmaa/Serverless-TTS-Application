> # **PollyBlogs: Text-to-Speech Blog Narration Application**

> ## **Overview**
> PollyBlogs is a powerful text-to-speech application that uses AWS Polly to generate voice narration for blog posts. It efficiently stores the generated audio files in an S3 bucket and checks for redundancy by determining whether an audio file already exists for a specific blog before generating it.

> ## **Key features:**
> - 🔊 Text-to-Speech Conversion: Converts blog text into audio using various Polly voices (Joanna, Matthew, Ivy, etc.).
> - 📦 S3 Storage: Uploads and stores audio files in Amazon S3 and retrieves them without duplicating existing files.
> - 🔐 Secure Access: Features JWT-based authentication to ensure user security for creating and accessing blogs.
> - 📝 Save and Replay Blogs: Users can save blogs, retrieve previously saved content, and replay the generated audio.
> - 🚀 Efficient Caching: Avoids regenerating audio if the same text with the same voice combination exists in S3.
>
> ## **Tech Stack Used**
> - **Frontend:** React.Js

> - Backend: AWS Lambda (Node.js), Serverless Framework

> - **Cloud Services:**
> - Amazon Polly: Text-to-speech
> - Amazon S3: File storage for audio files
> - Amazon DynamoDB: Database for user data and saved blogs
 
> - **Authentication:** JWT-based authentication

> - **Deployment:** AWS Lambda and S3

> - ## **Project Structure**
```
|-- authService/
|-- blogService/
|-- speechService/
|-- layers/
|-- frontend/
|-- serverless.yml
|-- README.md
```
