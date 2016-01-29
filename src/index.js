import routes from 'routes';
import configure from 'store';
import Root from 'containers/root';
import { render } from 'react-dom';
import { createHistory } from 'history';
import { match, sync } from 'rondpoint'
import { createElement as h } from 'react';

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
