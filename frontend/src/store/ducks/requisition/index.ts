import filesize from 'filesize';
import { Reducer } from 'redux';
import { RequisitionsState, RequisitionTypes, Requisition } from './types';

const INITIAL_STATE: RequisitionsState = {
  viewdata: [],
  error: false,
  loading: false,
  uploading: false,
  deleting: false,
};

const reducer: Reducer<RequisitionsState> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case RequisitionTypes.LOAD_REQUEST:
      return { ...state, loading: true, error: false };

    case RequisitionTypes.LOAD_SUCCESS: {
      const requisitions: Requisition[] = action.payload.data;
      const vdata = requisitions.map((req) => ({
        ...req,
        vId: req.id,
        preview: req.url,
        readableSize: filesize(req.size ? req.size : 0),
        uploaded: true,
      }));

      return {
        ...state,
        loading: false,
        error: false,
        viewdata: vdata,
      };
    }

    case RequisitionTypes.LOAD_FAILURE:
      return {
        ...state, loading: false, error: true, viewdata: [],
      };


    case RequisitionTypes.UPLOAD_REQUEST: {
      const req = action.payload;
      return {
        ...state, uploading: true, error: false, viewdata: state.viewdata.concat(req),
      };
    }

    case RequisitionTypes.UPLOAD_PROGRESS: {
      const requisitions: Requisition[] = state.viewdata;
      const upl = action.payload.data;

      const vdata = requisitions.map((req) => (req.vId === upl.vId
        ? upl
        : req));

      return {
        ...state, uploading: true, error: false, viewdata: vdata,
      };
    }

    case RequisitionTypes.UPLOAD_SUCCESS: {
      const requisitions: Requisition[] = state.viewdata;
      const upl = action.payload.data;

      const vdata = requisitions.map((req) => (req.vId === upl.vId
        ? {
          ...upl,
          vId: upl.id,
          preview: req.preview,
          readableSize: filesize(upl.size ? upl.size : 0),
          uploaded: true,
        }
        : req));

      return {
        ...state, uploading: false, error: false, viewdata: vdata,
      };
    }

    case RequisitionTypes.UPLOAD_FAILURE: {
      const vId = action.payload;

      const requisitions: Requisition[] = state.viewdata;

      const vdata = requisitions.map((req) => (req.vId === vId
        ? {
          ...req,
          error: true,
          preview: undefined,
          readableSize: undefined,
          uploaded: false,
          url: undefined,
        }
        : req));

      return {
        ...state, uploading: false, error: true, viewdata: vdata,
      };
    }


    case RequisitionTypes.DELETE_REQUEST: {
      return { ...state, deleting: true, error: false };
    }

    case RequisitionTypes.DELETE_SUCCESS: {
      const id = action.payload;
      const vdata: Requisition[] = state.viewdata.filter((file) => file.id !== id);
      return {
        ...state, deleting: false, error: false, viewdata: vdata,
      };
    }

    case RequisitionTypes.DELETE_FAILURE: {
      const id = action.payload;

      const requisitions: Requisition[] = state.viewdata;

      const vdata = requisitions.map((req) => (req.vId === id
        ? {
          ...req,
          error: true,
          preview: undefined,
          readableSize: undefined,
          uploaded: false,
          url: undefined,
        }
        : req));

      return {
        ...state, deleting: false, error: true, viewdata: vdata,
      };
    }
    default:
      return state;
  }
};

export default reducer;
