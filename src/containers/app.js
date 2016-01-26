import React, {DOM, Component} from 'react';
import { clickable } from 'rondpoint';


function Menu(props) {
    const { ul, li, a } = DOM;
    return ul({className: 'menu', onClick: props.onClick},
              li(null, a({href: '/'}, 'Home')),
              li(null, a({href: '/hello/test'}, 'Hello')),
              li(null, a({href: '/404'}, 'Not Found')));
}

function pushState(url) {
    return {type: 'HISTORY',
            payload: {
                method: 'pushState',
                args: url
            }};
}

class App extends Component {
    navigate(e) {
        const dispatch = this.props.store.dispatch;
        const target = e.target;
        const anchor = target.closest('a');

        if (clickable(e, anchor)) {
            e.preventDefault();
            const url = `${anchor.pathname}${anchor.search}`;
            dispatch(pushState(url));
        }
    }

    render() {
        const { section, h1 } = DOM;
        const content = React.Children.only(this.props.children);
        return section({id: 'app'},
                       h1(null, 'App'),
                       Menu({onClick: this.navigate.bind(this)}),
                       content);
    }
}

export default React.createFactory(App);
