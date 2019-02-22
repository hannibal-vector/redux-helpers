import _ from 'lodash';

export default function createScope(scopeName) {
  function type(actionSubstance) {
    if (actionSubstance.type) {
      return actionSubstance.type;
    }

    if (_.isFunction(actionSubstance)) {
      const { name } = actionSubstance;
      return {
        request: `${scopeName}/${name}/request`,
        success: `${scopeName}/${name}/success`,
        error: `${scopeName}/${name}/error`,
      };
    }

    if (_.isString(actionSubstance)) {
      return `${scopeName}/${actionSubstance}`;
    }

    throw new Error(
      'Unsupported action type, please supply function or string.',
    );
  }

  function promisedAction(actionFunction, actionName) {
    const typeName = type(actionName || actionFunction);

    const actionCreator = (...args) => async dispatch => {
      const request = args;
      dispatch({ type: typeName.request, request });
      try {
        const payload = await actionFunction(...args);
        dispatch({ type: typeName.success, request, payload });
      } catch (error) {
        dispatch({ type: typeName.error, request, error });
      }
    };

    actionCreator.type = typeName;
    return actionCreator;
  }

  function stringAction(actionName) {
    const typeName = type(actionName);

    const actionCreator = payload => ({ type: typeName, payload });
    actionCreator.type = typeName;

    return actionCreator;
  }

  function action(actionSubstance, actionName) {
    if (_.isFunction(actionSubstance)) {
      return promisedAction(actionSubstance, actionName);
    }

    if (_.isString(actionSubstance)) {
      return stringAction(actionSubstance);
    }

    throw new Error(
      'Unsupported action type, please supply function or string.',
    );
  }

  function actions(actionsStore) {
    return _.mapValues(actionsStore, (value, key) => action(value, key));
  }

  function selectors(statePrototype, statePath) {
    let getState;
    if (_.isFunction(statePath)) {
      getState = statePath;
    } else if (_.isString(statePath)) {
      getState = state => state[statePath];
    } else {
      getState = state => state[scopeName];
    }

    return _.mapValues(statePrototype, (__, key) => state =>
      getState(state)[key],
    );
  }

  return {
    type,
    action,
    actions,
    scopeName,
    selectors,
    createAction: action,
    createActions: actions,
    createSelectors: selectors,
  };
}
