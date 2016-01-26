import {createStore, applyMiddleware} from 'redux';
import createLogger from 'redux-logger';
import reducer from 'reducers';

export default function configure() {
    const createStoreWithMiddleware = applyMiddleware(createLogger())(createStore);
    const store = createStoreWithMiddleware(reducer);
    return store;
}
