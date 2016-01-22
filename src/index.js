import {render} from 'react-dom';
import {createHistory} from 'history';
import configure from 'store';
import App from 'containers/app';

const start = () => {
    const root = document.getElementById('root');
    const history = createHistory();
    const store = configure();

    history.listen((location) => {
        render(App({store}), root);
    });
};

export default start;
