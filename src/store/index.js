import {createStore, applyMiddleware} from 'redux';
import createLogger from 'redux-logger';
import {middleware as historyMiddleware} from 'rondpoint';
import reducer from 'reducers';

export default function configure(history) {
    const createStoreWithMiddleware = applyMiddleware(historyMiddleware(history),
                                                      createLogger())(createStore);
    const store = createStoreWithMiddleware(reducer);
    return store;
}
