import { resolveType as resolveTypeUnscoped } from './types';
import {
  createAction as createActionUnscoped,
  createActions as createActionsUnscoped,
} from './actions';
import { createSelectors as createSelectorsUnscoped } from './selectors';

export default function createScope(scopeName) {
  function resolveType(actionSubstance) {
    return resolveTypeUnscoped(scopeName, actionSubstance);
  }

  function createAction(actionSubstance, actionName) {
    return createActionUnscoped(scopeName, actionSubstance, actionName);
  }

  function createActions(store) {
    return createActionsUnscoped(scopeName, store);
  }

  function createSelectors(statePrototype, substatePath) {
    return createSelectorsUnscoped(scopeName, statePrototype, substatePath);
  }

  return {
    scopeName,
    resolveType,
    createAction,
    createActions,
    createSelectors,
    type: resolveType,
    action: createAction,
    actions: createActions,
    selectors: createSelectors,
  };
}
