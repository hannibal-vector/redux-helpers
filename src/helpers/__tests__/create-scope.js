import createScope from '../create-scope';

describe('createScope', () => {
  test('should return an object', () => {
    expect(typeof createScope('some-scope')).toBe('object');
  });

  describe('returned object should', () => {
    let scope;

    beforeAll(() => {
      scope = createScope('test-scope');
    });

    describe('contain helper functions', () => {
      const functionNames = [
        'type',
        'action',
        'actions',
        'selectors',
        'createAction',
        'createActions',
        'createSelectors',
      ];

      functionNames.forEach(property => {
        test(property, () => {
          expect(scope).toHaveProperty(property);
          expect(typeof scope[property]).toBe('function');
        });
      });
    });

    test('contain scopeName string', () => {
      expect(scope).toHaveProperty('scopeName');
      expect(typeof scope.scopeName).toBe('string');
    });
  });
});
