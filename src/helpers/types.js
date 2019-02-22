import _ from 'lodash';

export function createPromisedActionType(
  scopeName,
  actionFunction,
  actionName,
) {
  const { name } = actionFunction;
  const resolvedName = actionName || name;
  return {
    request: `${scopeName}/${resolvedName}/request`,
    success: `${scopeName}/${resolvedName}/success`,
    error: `${scopeName}/${resolvedName}/error`,
  };
}

export function createStringActionType(scopeName, actionName) {
  return `${scopeName}/${actionName}`;
}

export function resolveType(scopeName, actionSubstance) {
  if (actionSubstance.type) {
    return actionSubstance.type;
  }

  if (_.isFunction(actionSubstance)) {
    return createPromisedActionType(scopeName, actionSubstance);
  }

  if (_.isString(actionSubstance)) {
    return createStringActionType(scopeName, actionSubstance);
  }

  throw new Error('Unsupported action type, please supply function or string.');
}
