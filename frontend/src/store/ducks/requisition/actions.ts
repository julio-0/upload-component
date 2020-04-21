import { action } from 'typesafe-actions';
import { RequisitionTypes, Requisition } from './types';

export const loadRequest = () => action(RequisitionTypes.LOAD_REQUEST);

export const loadSuccess = (
  data: Requisition[],
) => action(RequisitionTypes.LOAD_SUCCESS, { data });

export const loadFailure = () => action(RequisitionTypes.LOAD_FAILURE);

export const uploadRequest = (
  requisition: Requisition,
) => action(RequisitionTypes.UPLOAD_REQUEST, requisition);

export const uploadSuccess = (
  data: Requisition,
) => action(RequisitionTypes.UPLOAD_SUCCESS, { data });

export const uploadProgress = (
  data: Requisition,
) => action(RequisitionTypes.UPLOAD_PROGRESS, { data });

export const uploadFailure = (vId: string) => action(RequisitionTypes.UPLOAD_FAILURE, vId);


export const deleteRequest = (id: string) => action(RequisitionTypes.DELETE_REQUEST, id);

export const deleteSuccess = (id: string) => action(RequisitionTypes.DELETE_SUCCESS, id);

export const deleteFailure = (id: string) => action(RequisitionTypes.DELETE_FAILURE, id);
