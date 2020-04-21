import { Request, Response } from 'express';
import RequisitionModel, { Requisition } from '../models/Requisition';
import aws from 'aws-sdk';
const fs = require('fs');
const path = require('path');

const s3 = new aws.S3();


class RequisitionController {
    public async list (request: Request, response: Response): Promise<Response> {
        const data = await RequisitionModel.find();

        const requisitions = data.map((requisition) => ({
          id: requisition._id,
          name: requisition.name,
          key: requisition.key,
          url: requisition.url,
          storage: requisition.storage,
          size: requisition.size,
          type: requisition.type,
          createdAt: requisition.createdAt,
          version: requisition.__v
        }));
      
      
        return response.json({
          requisitions    
        });
    }

    public async delete (request: Request, response: Response): Promise<Response> {
        const id = request.params.id
        const requisition = await RequisitionModel.findById(id);
      
      
        if (!requisition) return response.status(404).json({ id, error: 'Requisition not found.'});
      
        try {
          await requisition.remove().catch((e) => { });
        
          return response.json({
            id    
          });      
        } catch (error) {
          return response.status(error.status || 404).json({ id, error});   
        }      
    }  

    public async reset (request: Request, response: Response): Promise<Response> {
        try {
            const requisitions = await RequisitionModel.find();

            await requisitions.forEach(function(requisition){
              requisition.remove().catch((e) => { })
            });
          
            return response.send();            
        } catch (error) {
          return response.status(error.status || 404).json({ error});   
        }      
    }
    
    public async upload (request: Request, response: Response): Promise<Response> {
        try {
            const { originalname: name, filename: key, mimetype: type, size} = request.file;
            const { vId } = request.body;          
            const storage = process.env.STORAGE_TYPE || '';
          
            // let requisition: Requisition;
            const requisition = await RequisitionModel.create({
              name,
              key,
              storage,
              size,
              type,
            });   

            if (storage === 's3') {
              await this.uploadS3Storage(requisition, key, type);
            } 

            return response.json({ 
              requisition: {
                vId, 
                id: requisition._id,
                name: requisition.name,
                key: requisition.key,
                url: requisition.url,
                storage: requisition.storage,
                size: requisition.size,
                type: requisition.type,
                createdAt: requisition.createdAt,
                version: requisition.__v,
                data: requisition.data
              }
            });          
        } catch (error) {
          return response.status(error.status || 404).json({ error});   
        }      
    }

    private async uploadS3Storage(requisition: Requisition, key: string, type: string): Promise<Requisition>{   
      await this.uploadToS3(key, type).then((dataAws: aws.S3.ManagedUpload.SendData) => {
          requisition.url = dataAws.Location;
          requisition.markModified('url');
          requisition.save();  
      });
      
      fs.unlink(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', key), function (err: Error) {
          if (err) throw err;
      });

      return requisition;

    }
    
    private async uploadToS3(key: string, type: string): Promise<aws.S3.ManagedUpload.SendData> {
      const fileName = path.resolve(__dirname, '..', '..', 'tmp', 'uploads', key);
      const readStream = fs.createReadStream(fileName);

      const params: aws.S3.PutObjectRequest = {
          Bucket: process.env.AWS_S3_BUCKET || '',
          Key:  key, // File name you want to save as in S3
          Body: readStream,
          ContentType: type,
          ACL: 'public-read'
      };
      
      return new Promise<aws.S3.ManagedUpload.SendData>((resolve, reject) => {
          s3.upload(params, function(err: Error, data: aws.S3.ManagedUpload.SendData) {
          readStream.destroy();
          
          if (err) {
              return reject(err);
          }
          
          return resolve(data);
          });
      });
    }    
}

export default new RequisitionController()