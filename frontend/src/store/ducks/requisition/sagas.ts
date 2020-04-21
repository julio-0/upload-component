import {
  call, put, take, fork,
} from 'redux-saga/effects';
import {
  eventChannel, END, EventChannel,
} from 'redux-saga';
import { AnyAction } from 'redux';
import api from '../../../services/api';
import {
  loadSuccess,
  loadFailure,
  uploadSuccess,
  uploadProgress,
  uploadFailure,
  deleteSuccess,
  deleteFailure,
} from './actions';

export function* load() {
  try {
    const response = yield call(api.get, 'requisition');

    yield put(loadSuccess(response.data.requisitions));
  } catch (error) {
    yield put(loadFailure());
  }
}

function* uploadProgressWatcher(chan: EventChannel<ProgressEvent>) {
  while (true) { // eslint-disable-line no-constant-condition
    const progress = yield take(chan);
    yield put(uploadProgress(progress));
  }
}

function uploadChannel(files: AnyAction, onUploadProgress: (
  { total, loaded }: ProgressParams) => void) {
  const requisition = files.payload;
  const formData = new FormData();
  formData.append('vId', requisition.vId);

  formData.append('file', requisition.file);

  return api.post('requisition', formData, { onUploadProgress });
}

interface ProgressParams {
  total: number
  loaded: number
}

function createUploader(files: AnyAction) {
  let emit: (input: unknown) => void;
  const chan = eventChannel((emitter) => {
    emit = emitter;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  });
  const requisition = files.payload;
  const uploadProgressCb = ({ total, loaded }: ProgressParams) => {
    const percentage = Math.round((loaded * 100) / total);
    requisition.progress = percentage;
    emit(requisition);
    if (percentage === 100) {
      requisition.uploaded = true;
      emit(requisition);
      emit(END);
    }
  };
  const uploadPromise = uploadChannel(files, uploadProgressCb);
  return [uploadPromise, chan];
}

// Typescript still have some problems with redux-saga,so i'm skipping these
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export function* upload(action: AnyAction) {
  try {
    const [uploadPromise, chan] = yield call(createUploader, action);
    yield fork(uploadProgressWatcher, chan);
    const res = yield call(() => uploadPromise);
    yield put(uploadSuccess(res.data.requisition));
  } catch (e) {
    const req = action.payload;
    // console.log({ req });
    yield put(uploadFailure(req.vId));
  }
}

export function* deleteReq(action: AnyAction) {
  try {
    const id = action.payload;
    const res = yield call(api.delete, `requisition/${id}`);

    // console.log('sucesso!');
    yield put(deleteSuccess(res.data.id));
  } catch (error) {
    const id = action.payload;
    // const { data } = error.response;
    // console.log({ data });
    yield put(deleteFailure(id));
  }
}
