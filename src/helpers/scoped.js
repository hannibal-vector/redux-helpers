import { resolveType as resolveTypeUnscoped } from './types';
import {
  createAction as createActionUnscoped,
  createActions as createActionsUnscoped,
} from './actions';

export function scoped(scopeName) {
  function resolveType(actionSubstance) {
    return resolveTypeUnscoped(scopeName, actionSubstance);
  }

  function createAction(actionSubstance, actionName) {
    return createActionUnscoped(scopeName, actionSubstance, actionName);
  }

  function createActions(store) {
    return createActionsUnscoped(scopeName, store);
  }

  return {
    resolveType,
    createAction,
    createActions,
    type: resolveType,
    action: createAction,
    actions: createActions,
  };
}
