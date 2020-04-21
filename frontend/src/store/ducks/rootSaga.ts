import { all, takeLatest, takeEvery } from 'redux-saga/effects';
import { RequisitionTypes } from './requisition/types';
import { load, upload, deleteReq } from './requisition/sagas';

export default function* rootSaga() {
  return yield all([
    takeLatest(RequisitionTypes.LOAD_REQUEST, load),
    takeLatest(RequisitionTypes.DELETE_REQUEST, deleteReq),
    takeEvery(RequisitionTypes.UPLOAD_REQUEST, upload),
  ]);
}
