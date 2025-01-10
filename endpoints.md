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