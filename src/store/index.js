import {createStore, applyMiddleware} from 'redux';
import reducer from 'reducers';

export default function configure() {
    const store = createStore(reducer);
}
