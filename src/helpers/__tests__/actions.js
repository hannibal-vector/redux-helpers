import { createAction } from '../actions';

describe('createAction', () => {
  describe('for passed string creates simple action creator', () => {
    let simpleAction;
    beforeAll(() => {
      simpleAction = createAction('test-scope', 'simple-action');
    });

    test('that has a correct type', () => {
      expect(simpleAction).toHaveProperty('type');
      expect(simpleAction.type.success).toEqual(
        'test-scope/simple-action/success',
      );
    });

    test('that passes the argument as action payload', () => {
      expect(simpleAction(1)).toEqual({
        type: 'test-scope/simple-action/success',
        payload: 1,
      });
    });
  });

  describe('for passed function creates thunk', () => {
    test('that has a correct type based on function name', () => {
      const mockFunction = jest.fn();
      const thunkAction = createAction('test-scope', mockFunction);
      const functionName = mockFunction.name;
      expect(thunkAction).toHaveProperty('type');
      expect(thunkAction.type).toEqual({
        request: `test-scope/${functionName}/request`,
        success: `test-scope/${functionName}/success`,
        error: `test-scope/${functionName}/error`,
      });
    });

    test('action name can be overriden', () => {
      const mockFunction = jest.fn();
      const thunkAction = createAction(
        'test-scope',
        mockFunction,
        'my-beautiful-thunk',
      );
      expect(thunkAction).toHaveProperty('type');
      expect(thunkAction.type).toEqual({
        request: `test-scope/my-beautiful-thunk/request`,
        success: `test-scope/my-beautiful-thunk/success`,
        error: `test-scope/my-beautiful-thunk/error`,
      });
    });

    test('thunk is called with correct arguments and produces correct result', async () => {
      const mockFunction = jest.fn((x, y) => x + y);
      const thunkAction = createAction(
        'test-scope',
        mockFunction,
        'my-beautiful-thunk',
      );
      const dispatch = jest.fn();
      const result = await thunkAction(2, 3)(dispatch);
      expect(result).toBe(5);
    });

    test('thunk should dispatch request and success actions', async () => {
      const mockFunction = jest.fn((x, y) => Promise.resolve(x + y));
      const thunkAction = createAction(
        'test-scope',
        mockFunction,
        'my-beautiful-thunk',
      );
      const dispatch = jest.fn();
      await thunkAction(2, 3)(dispatch);
      expect(dispatch).toBeCalledTimes(2);
      expect(dispatch).toBeCalledWith({
        type: 'test-scope/my-beautiful-thunk/request',
        request: [2, 3],
      });
      expect(dispatch).toBeCalledWith({
        type: 'test-scope/my-beautiful-thunk/success',
        request: [2, 3],
        payload: 5,
      });
    });

    test('thunk should dispatch request and error actions', async () => {
      const error = new Error('A little error!');
      const mockFunction = jest.fn(() => {
        throw error;
      });
      const thunkAction = createAction(
        'test-scope',
        mockFunction,
        'my-beautiful-thunk',
      );
      const dispatch = jest.fn();
      await thunkAction('something')(dispatch);
      expect(dispatch).toBeCalledTimes(2);
      expect(dispatch).toBeCalledWith({
        type: 'test-scope/my-beautiful-thunk/request',
        request: ['something'],
      });
      expect(dispatch).toBeCalledWith({
        type: 'test-scope/my-beautiful-thunk/error',
        request: ['something'],
        error,
      });
    });
  });

  describe('should accept scope providing function instead of scope name', () => {
    test('when creating simple actions', () => {
      const simpleAction = createAction(
        () => 'provided-scope',
        'simple-action',
      );
      expect(simpleAction).toHaveProperty('type');
      expect(simpleAction.type.success).toEqual(
        'provided-scope/simple-action/success',
      );
    });

    test('when creating thunk that completes successfully', async () => {
      const mockFunction = jest.fn((x, y) => Promise.resolve(x * y));
      const thunkAction = createAction(
        () => 'provided-scope',
        mockFunction,
        'my-beautiful-thunk',
      );
      const dispatch = jest.fn();
      await thunkAction(2, 3)(dispatch);
      expect(dispatch).toBeCalledTimes(2);
      expect(dispatch).toBeCalledWith({
        type: 'provided-scope/my-beautiful-thunk/request',
        request: [2, 3],
      });
      expect(dispatch).toBeCalledWith({
        type: 'provided-scope/my-beautiful-thunk/success',
        request: [2, 3],
        payload: 6,
      });
    });

    test('when creating thunk that throws an error', async () => {
      const error = new Error('Bam!');
      const mockFunction = jest.fn(() => {
        throw error;
      });
      const thunkAction = createAction(
        () => 'provided-scope',
        mockFunction,
        'my-beautiful-thunk',
      );
      const dispatch = jest.fn();
      await thunkAction('something else')(dispatch);
      expect(dispatch).toBeCalledTimes(2);
      expect(dispatch).toBeCalledWith({
        type: 'provided-scope/my-beautiful-thunk/request',
        request: ['something else'],
      });
      expect(dispatch).toBeCalledWith({
        type: 'provided-scope/my-beautiful-thunk/error',
        request: ['something else'],
        error,
      });
    });
  });
});
