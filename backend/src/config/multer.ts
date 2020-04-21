import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
// import aws from 'aws-sdk';
// import multerS3 from 'multer-s3';
import * as dotenv from "dotenv";

dotenv.config();

const storageTypes = {
    local: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if(err) cb(err, file.originalname);
                const parts = file.originalname.split('.');
                file.filename = `${parts[0]}_${hash.toString('hex')}.${parts[1]}`;
                // console.log(file.originalname);
                cb(null, file.filename);
            } )
        },
    }),
   /*  s3: multerS3({
        s3: new aws.S3(),
        bucket: process.env.AWS_S3_BUCKET || '',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if(err) cb(err);
                const parts = file.originalname.split('.');
                file.filename = `${parts[0]}_${hash.toString('hex')}.${parts[1]}`;
                cb(null, file.filename);
            } )
        }
    }) */
};

// console.log(process.env.STORAGE_TYPE);

const multerConfig = {
    dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: storageTypes['local'],
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    filefilter: (req: Request, file: File, cb: multer.FileFilterCallback) => {
        const allowedMimes = [
            "image/jpeg",
            "image/pjpeg",
            "image/png",
            "image/gif"
          ];
        if (allowedMimes.includes(file.type)){
            cb(null, true);            
        } else {
            cb(new Error("Invalid file type."));
        }
    }
};

export default multerConfig;