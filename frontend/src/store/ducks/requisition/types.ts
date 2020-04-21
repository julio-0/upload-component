/**
 * Action types
 */
export enum RequisitionTypes {
  LOAD_REQUEST = '@requisitions/LOAD_REQUEST',
  LOAD_SUCCESS = '@requisitions/LOAD_SUCCESS',
  LOAD_FAILURE = '@requisitions/LOAD_FAILURE',
  UPLOAD_REQUEST = '@requisitions/UPLOAD_REQUEST',
  UPLOAD_PROGRESS = '@requisitions/UPLOAD_PROGRESS',
  UPLOAD_SUCCESS = '@requisitions/UPLOAD_SUCCESS',
  UPLOAD_FAILURE = '@requisitions/UPLOAD_FAILURE',
  DELETE_REQUEST = '@requisitions/DELETE_REQUEST',
  DELETE_SUCCESS = '@requisitions/DELETE_SUCCESS',
  DELETE_FAILURE = '@requisitions/DELETE_FAILURE',
}

/**
 * Data types
 */
export interface Requisition {
  vId?: string // frontend virtual requisition id
  id?: string // database id
  name?: string
  size?: number
  type?: string
  key?: string
  url?: string
  storage? : string
  file? : File
  readableSize?: string
  preview?: string
  progress?: number
  uploaded?: boolean
  error?: boolean
}

/**
 * State type
 */
export interface RequisitionsState {
  // readonly data: Requisition[]
  readonly viewdata: Requisition[]
  readonly loading: boolean
  readonly uploading: boolean
  readonly deleting: boolean
  readonly error: boolean
}
