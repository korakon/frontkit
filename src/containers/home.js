import React, { DOM } from 'react';


class Home extends React.Component {
    render() {
        const {section, h1, pre} = DOM;
        return section({className: 'home'},
                       h1(null, 'Home Page'),
                       pre(null, '> emacs /src/containers/app.js   # to start hacking'));
    }
}

export default React.createFactory(Home);
