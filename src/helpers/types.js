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

function resolveScopeProvider(scopeName) {
  if (_.isFunction(scopeName)) {
    return scopeName;
  }

  if (_.isString(scopeName)) {
    return () => scopeName;
  }

  throw new Error('Scope name must be function or string.');
}

export function createPromisedActionType(
  scopeName,
  actionFunction,
  actionName,
) {
  const resolvedName = resolveActionName(actionFunction, actionName);
  const scopeProvider = resolveScopeProvider(scopeName);

  return {
    get request() {
      return `${scopeProvider()}/${resolvedName}/request`;
    },
    get success() {
      return `${scopeProvider()}/${resolvedName}/success`;
    },
    get error() {
      return `${scopeProvider()}/${resolvedName}/error`;
    },
  };
}

export function createStringActionType(scopeName, actionName) {
  const scopeProvider = resolveScopeProvider(scopeName);
  return {
    get success() {
      return `${scopeProvider()}/${actionName}/success`;
    },
  };
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
