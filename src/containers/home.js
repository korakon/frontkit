import React, { DOM } from 'react';
import { connect } from 'react-redux';


class Home extends React.Component {
  render() {
    const { section, h1, pre } = DOM;
    return section({ className: 'home' },
                   h1(null, 'Home Page'),
                   pre(null, '> emacs /src/containers/app.js   # to start hacking'));
  }
}

function select(state) {
  return { todos: state.todos };
}

export default connect(select)(Home);
