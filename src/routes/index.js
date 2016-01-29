import { route } from 'rondpoint';
import Home from 'containers/home';
import NotFound from 'containers/notfound';

const routes = [
  route('/', Home),
  route(/.*/, NotFound)
];

export default routes;
