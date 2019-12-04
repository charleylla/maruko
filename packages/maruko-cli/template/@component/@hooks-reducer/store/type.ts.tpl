import { prefixActionTypes } from '~/framework/util/common';

export const TYPES = {
  SET_LOADING: 'SET_LOADING'
};

prefixActionTypes('%_StorePrefixName_%')(TYPES);
