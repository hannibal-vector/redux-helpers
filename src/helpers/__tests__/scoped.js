import { scoped } from '../scoped';

describe('scoped', () => {
  test('should return an object', () => {
    expect(typeof scoped('some-scope')).toBe('object');
  });

  describe('should contain helper functions', () => {
    const functionNames = [
      'type',
      'action',
      'actions',
      'resolveType',
      'createAction',
      'createActions',
    ];

    let scopedHelpers;

    beforeAll(() => {
      scopedHelpers = scoped('test-scope');
    });

    functionNames.forEach(property => {
      test(property, () => {
        expect(scopedHelpers).toHaveProperty(property);
        expect(typeof scopedHelpers[property]).toBe('function');
      });
    });
  });
});
