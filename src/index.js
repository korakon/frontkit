import { render } from 'react-dom';
import { createHistory } from 'history';
import configure from 'store';
import routes from 'routes';
import { match } from 'rondpoint';
import App from 'containers/app';

const start = () => {
    const root = document.getElementById('root');
    const history = createHistory();
    const store = configure();

    history.listen((location) => {
        const { route } = match(location.pathname, routes);
        //store.dispatch(sync(location, params));
        render(App({ store }, route.handler({ store })), root);
    });
};


export {start};
