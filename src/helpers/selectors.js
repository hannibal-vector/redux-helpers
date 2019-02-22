import _ from 'lodash';

function resolveSubstateSelector(scopeName, substatePath) {
  if (_.isFunction(substatePath)) {
    return substatePath;
  }

  if (_.isString(substatePath)) {
    return state => state[substatePath];
  }

  return state => state[scopeName];
}

export function createSelectors(scopeName, statePrototype, substatePath) {
  const substateSelector = resolveSubstateSelector(scopeName, substatePath);
  return _.mapValues(statePrototype, (__, key) => state =>
    substateSelector(state)[key],
  );
}

export function composeSelectors(selectorsToCompose) {
  return state => _.mapValues(selectorsToCompose, selector => selector(state));
}
