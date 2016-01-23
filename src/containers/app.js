import React, {DOM, Component} from 'react';

class App extends Component {
    render() {
        const {section, h1, pre} = DOM;
        return section({id: 'app'},
                       h1(null, 'App'),
                       pre(null, '> emacs /src/containers/app.js   # to start hacking'),
                       this.props.children);
    }
}

export default React.createFactory(App);
