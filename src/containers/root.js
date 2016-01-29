import { createElement as h } from 'react';
import { Provider } from 'react-redux';
import App from 'containers/app';

export default function Root(props) {
  const { store, handler } = props;
  return h(Provider, { store },
           h(App, null, handler));
}
