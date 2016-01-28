import { createFactory } from 'react';
import { render } from 'react-dom';
import { createHistory } from 'history';
import configure from 'store';
import routes from 'routes';
import { match, sync } from 'rondpoint';
import App from 'containers/app';

const start = () => {
    const root = document.getElementById('root');
    const history = createHistory();
    const store = configure(history);
    history.listen((location) => {
        const { route, params } = match(location.pathname, routes);
        store.dispatch(sync(location, params));
        render(App({ store, dispatch: store.dispatch }, route.handler), root);
    });
};

export {start};
