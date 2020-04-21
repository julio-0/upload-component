import mongoose from 'mongoose';
import aws from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
// import * as dotenv from "dotenv";

// dotenv.config();

const s3 = new aws.S3();

export interface Requisition extends mongoose.Document {
    vId?: string // frontend virtual requisition id
    id?: string // database id
    name?: string
    size?: number
    type?: string
    key?: string
    url?: string
    storage? : string
    createdAt?: Date
    data: [{}]
  }
  

const RequisitionSchema = new mongoose.Schema<Requisition>({
    name: String,
    key: String,
    url: String,
    storage: String,
    size: Number,
    type: String,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

RequisitionSchema.pre<Requisition>('save', function(){
    if(this.storage === 'local'){
        this.url = `${process.env.APP_URL}/files/${this.key}`;
    }
});

RequisitionSchema.pre<Requisition>('remove', function(){
    if(this.storage === 's3'){
        return s3.deleteObject({
            Bucket: process.env.AWS_S3_BUCKET || '',
            Key: this.key || '',
        }).promise();
    } else {
        if (!this.key) return;
        return promisify(fs.unlink)(
            path.resolve(__dirname, '../..', 'tmp', 'uploads', this.key)        
        );
    }
});

const RequisitionModel = mongoose.model<Requisition>('Requisition', RequisitionSchema);
export default RequisitionModel;