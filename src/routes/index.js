import { route } from 'rondpoint';
import Home from 'containers/home';
import NotFound from 'containers/notfound';

export const routes = [
    route('/', Home),
    route(/.*/, NotFound)
];

export default routes;
