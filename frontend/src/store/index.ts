import { createStore, Store, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { RequisitionsState } from './ducks/requisition/types';

import rootReducer from './ducks/rootReducer';
import rootSaga from './ducks/rootSaga';

export interface ApplicationState {
  requisitions: RequisitionsState
}

const sagaMiddleware = createSagaMiddleware();
const store: Store<ApplicationState> = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);
export default store;
