import _ from 'lodash';

function resolveActionName(actionFunction, actionName) {
  if (actionName) {
    return actionName;
  }

  const { name } = actionFunction;
  if (name) {
    return name;
  }

  throw new Error(
    'Supplied function has no name and no action name is supplied.',
  );
}

export function createPromisedActionType(
  scopeName,
  actionFunction,
  actionName,
) {
  const resolvedName = resolveActionName(actionFunction, actionName);

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
