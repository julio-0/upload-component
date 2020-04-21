import express from 'express';
import RequisitionController from './controllers/RequisitionController';
import multer from 'multer';
import multerConfig from './config/multer';

const router = express.Router();

router.get('/requisition', RequisitionController.list);

router.delete('/requisition/:id', RequisitionController.delete); 

router.delete('/requisition', RequisitionController.reset);

router.post('/requisition', multer(multerConfig).single('file'), RequisitionController.upload.bind(RequisitionController));

//// * With multer error handling
// const up = multer(multerConfig).single('file');
// router.post('/requisition', function (req, res) {
//     up(req, res, function (err) {
//       if (err instanceof multer.MulterError) {
//         // A Multer error occurred when uploading.
//         console.log('multer: ', err);
//       } else if (err) {
//         // An unknown error occurred when uploading.
//         console.log(err);
//       }
//       // Everything went fine.
//       RequisitionController.upload(req, res); 
//     });
//   });

export default router;