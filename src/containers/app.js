import React, {DOM, Component} from 'react';

class App extends Component {
    render() {
        const {section, h1} = DOM;
        section({id: 'app'},
                h1(null, 'My app'),
                this.props.children);
    }
}

export default React.createFactory(App);
