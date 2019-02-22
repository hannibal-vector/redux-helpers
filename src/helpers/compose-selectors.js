import _ from 'lodash';

export default function composeSelectors(selectorsToCompose) {
  return state => _.mapValues(selectorsToCompose, selector => selector(state));
}
