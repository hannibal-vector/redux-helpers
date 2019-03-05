import _ from 'lodash';

function resolveDefaultState(stateShapeProvider) {
  if (_.isFunction(stateShapeProvider)) {
    return stateShapeProvider(undefined, { type: undefined });
  }

  if (_.isObject(stateShapeProvider)) {
    return stateShapeProvider;
  }

  throw new Error('Please provide default state or reducer.');
}

function resolveStateSelector(statePath) {
  if (_.isFunction(statePath)) {
    return statePath;
  }

  if (_.isString(statePath)) {
    return _.property(statePath);
  }

  throw new Error('Provide path to substate or function extracting substate.');
}

export function createSelectors(stateShapeProvider, statePath) {
  const defaultState = resolveDefaultState(stateShapeProvider);
  const stateSelector = resolveStateSelector(statePath);

  if (_.isArray(defaultState) || !_.isObject(defaultState)) {
    return stateSelector;
  }

  return _.mapValues(defaultState, (defaultValue, key) => state =>
    stateSelector(state)[key],
  );
}

export const selectors = createSelectors;

export function combineSelectors(selectorsToCombine) {
  return state => _.mapValues(selectorsToCombine, selector => selector(state));
}
