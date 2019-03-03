import _ from 'lodash';
import { createPromisedActionType, createStringActionType } from './types';

function createPromisedAction(scopeName, actionFunction, actionName) {
  const type = createPromisedActionType(scopeName, actionFunction, actionName);

  const actionCreator = (...args) => async dispatch => {
    const request = args;
    dispatch({ type: type.request, request });
    try {
      const payload = await actionFunction(...args);
      dispatch({ type: type.success, request, payload });
      return payload;
    } catch (error) {
      dispatch({ type: type.error, request, error });
    }
  };

  actionCreator.type = type;
  return actionCreator;
}

function createStringAction(scopeName, actionName) {
  const type = createStringActionType(scopeName, actionName);

  const actionCreator = payload => ({ type: type.success, payload });
  actionCreator.type = type;

  return actionCreator;
}

export function createAction(scopeName, actionSubstance, actionName) {
  if (_.isFunction(actionSubstance)) {
    return createPromisedAction(scopeName, actionSubstance, actionName);
  }

  if (_.isString(actionSubstance)) {
    return createStringAction(scopeName, actionSubstance);
  }

  throw new Error(
    'Unsupported parameter type passed to action creator. Please supply function or string.',
  );
}

export function createActions(scopeName, store) {
  return _.mapValues(store, (actionFunction, actionName) =>
    createAction(scopeName, actionFunction, actionName),
  );
}
