import { combineReducers } from 'redux';
import { reducer as router } from 'rondpoint';

const initial = {
  todos: {
    1: { text: 'Ayy' },
    2: { text: 'lmao' }
  }
};

function todos(state=initial.todos) {
  return state;
}

export default combineReducers({
  router,
  todos
});
