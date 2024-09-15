import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

async function uploadToS3(file: File) {
  const client = new S3Client({
    region: import.meta.env.VITE_AWS_REGION,
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID!,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY!,
    },
  });

  const params = {
    Bucket: import.meta.env.VITE_S3_BUCKET_NAME!,
    Key: new Date().toISOString() + "-" + file.name,
    Body: file /** object body */,
  };

  const command = new PutObjectCommand(params);
  const data = await client.send(command);
  console.log(data);

  //   return url
  return `https://${import.meta.env.VITE_S3_BUCKET_NAME}.s3.${
    import.meta.env.VITE_AWS_REGION
  }.amazonaws.com/${params.Key}`;
}

export default uploadToS3;
