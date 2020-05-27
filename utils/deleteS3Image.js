const aws = require( 'aws-sdk' )
require('dotenv').config()

const s3Credential = new aws.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_KEY_ID,
    Bucket: 'bend-and-select.com'
   });

exports.s3 = s3Credential

exports.deleteS3Image =(imageKey)=>{
    s3Credential.deleteObject({
        Bucket: 'bend-and-select.com',
        Key: imageKey
      },function (err,data){
          if(err){
              console.log(err)
          }
      })
}
  