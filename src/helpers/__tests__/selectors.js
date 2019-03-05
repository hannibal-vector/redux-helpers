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

  test('for reducer returning a string primitive, should return the whole state', () => {
    function reducer(state = '', action) {
      switch (action.type) {
        case 'add':
          return state + action.payload;
        default:
          return state;
      }
    }

    const selector = createSelectors(reducer, state => state.deep);

    const other = {
      deep: 'bla'
    };

    expect(selector(other)).toBe('bla');
  });

  test('for reducer returning a number primitive, should return the whole state', () => {
    function reducer(state = 0, action) {
      switch (action.type) {
        case 'add':
          return state + action.payload;
        default:
          return state;
      }
    }

    const selector = createSelectors(reducer, state => state.deep);

    const other = {
      deep: 5
    };

    expect(selector(other)).toBe(5);
  });

  test('for reducer returning an array, should return the whole state', () => {
    function reducer(state = [], action) {
      switch (action.type) {
        case 'add':
          return [...state, action.payload];
        default:
          return state;
      }
    }

    const selector = createSelectors(reducer, state => state.deep);

    const other = {
      deep: [23]
    };

    expect(selector(other)).toEqual([23]);
  });
});
