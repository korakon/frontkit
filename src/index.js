import routes from 'routes';
import configure from 'store';
import App from 'containers/app';
import { render } from 'react-dom';
import { createHistory } from 'history';
import { match, sync } from 'rondpoint';
import { createElement as h } from 'react';
import { Provider } from 'react-redux';

const start = () => {
  const el = document.getElementById('root');
  const history = createHistory();
  const store = configure(history);

  history.listen((location) => {
    const { route: { handler }, params } = match(location.pathname, routes);
    store.dispatch(sync(location, params));
    render(h(Provider, { store },
             h(App, null, h(handler))), el);
  });
};

export { start };
