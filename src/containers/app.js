import { DOM, Component, Children, PropTypes } from 'react';
import { clickable, push } from 'rondpoint';
import { connect } from 'react-redux';
import { createElement as h } from 'react';


function Menu(props) {
  const { ul, li, a } = DOM;
  return ul({ className: 'menu', onClick: props.onClick },
            li(null, a({ href: '/' }, 'Home')),
            li(null, a({ href: '/hello/test' }, 'Hello')),
            li(null, a({ href: '/404' }, 'Not Found')));
}


class App extends Component {
  navigate(e) {
    const { dispatch } = this.props;
    const target = e.target;
    const anchor = target.closest('a');

    if (clickable(e, anchor)) {
      e.preventDefault();
      const url = `${anchor.pathname}${anchor.search}`;
      dispatch(push(url));
    }
  }

  render() {
    const { section, h1 } = DOM;
    const { children } = this.props;
    const content = Children.only(children);
    return section({ id: 'app' },
                   h1(null, 'App'),
                   h(Menu, { onClick: this.navigate.bind(this) }),
                   content);
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.element,
};

export default connect()(App);
