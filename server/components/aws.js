'use strict';

var AWS = require('aws-sdk');
var fs = require('fs');
import sharp from 'sharp';

export function uploadImage(file, filePath, fileName, returnObject) {
  if (file) {
    let appSetting = global.applicationSettings;
    if(appSetting && appSetting.cdnServer) {
      let fileStream = fs.createReadStream(file.path);
      fileStream.on('error', function (err) {
        return Promise.reject(err);
      });

      AWS.config.update({
        accessKeyId: appSetting.cdnServer.accessKeyId,
        secretAccessKey: appSetting.cdnServer.secretAccessKey,
        region: appSetting.cdnServer.region
      });

      let uploadParams = {
        Bucket: appSetting.cdnServer.bucketName,
        Key: filePath.concat(fileName),
        Body: fileStream,
        ACL: 'public-read'
      };

      let s3 = new AWS.S3();
      return uploadToS3(s3, uploadParams)
        .then(() => {
          return sharp(file.path)
            .resize(150)
            .toBuffer();
        })
        .then((thumbStream) => {
          uploadParams = {
            Bucket: appSetting.cdnServer.bucketName,
            Key: filePath.concat('thumbnail/').concat(fileName),
            Body: thumbStream,
            ACL: 'public-read'
          };

          return uploadToS3(s3, uploadParams);
        })
        .then(() => {
          return Promise.resolve(returnObject);
        });
    } else {
      return Promise.reject(new Error('Global application setting is undefined'));
    }
  } else {
    return Promise.reject(new Error('No file to upload'));
  }
}

function uploadToS3(s3, uploadParams) {
  return new Promise(function (resolve, reject) {
    s3.upload(uploadParams, function (err, data) {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
}
