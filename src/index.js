import { createElement as h } from 'react';
import { render } from 'react-dom';
import { createHistory } from 'history';
import configure from 'store';
import routes from 'routes';
import { match, sync } from 'rondpoint';
import Root from 'containers/root';

const start = () => {
  const el = document.getElementById('root');
  const history = createHistory();
  const store = configure(history);

  history.listen((location) => {
    const { route: { handler }, params } = match(location.pathname, routes);
    store.dispatch(sync(location, params));
    render(h(Root, { store, handler }), el);
  });
};

export {start};
