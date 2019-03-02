import { createSelectors } from '../selectors';

describe('createSelectors', () => {
  test('should create selectors using model state, such as default state', () => {
    const defaultState = {
      name: 'Ana',
      age: 20,
      id: null,
    };

    const selectors = createSelectors(defaultState, 'deeper.somewhere');

    expect(selectors).toHaveProperty('name');
    expect(selectors).toHaveProperty('age');
    expect(selectors).toHaveProperty('id');

    const other = {
      deeper: {
        somewhere: {
          name: 'Julia',
          age: 40,
          id: 'abc',
        },
      },
    };

    const { name, age, id } = selectors;
    expect(name(other)).toBe('Julia');
    expect(age(other)).toBe(40);
    expect(id(other)).toBe('abc');
  });

  test('should create selectors using reducer', () => {
    const defaultState = {
      name: 'Ana',
      age: 20,
      id: null,
    };

    function reducer(state = defaultState, action) {
      switch (action.type) {
        case 'change-name':
          return {
            ...state,
            name: action.payload,
          };
        case 'add-age':
          return {
            ...state,
            age: action.payload,
          };
        default:
          return state;
      }
    }

    const selectors = createSelectors(reducer, state => state.deep);

    expect(selectors).toHaveProperty('name');
    expect(selectors).toHaveProperty('age');
    expect(selectors).toHaveProperty('id');

    const other = {
      deep: {
        name: 'Julia',
        age: 40,
        id: 'abc',
      },
    };

    const { name, age, id } = selectors;
    expect(name(other)).toBe('Julia');
    expect(age(other)).toBe(40);
    expect(id(other)).toBe('abc');
  });
});
