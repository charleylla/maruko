import { IAction } from '~/solution/shared/interfaces/common.interface';
import { IState } from '../fname.interface';
import { TYPES } from './type';

export const initialState: IState = {
  loading: false
};

export function reducer(state = initialState, action: IAction<any>) {
  const { type, payload } = action;
  switch (type) {
    case TYPES.SET_LOADING:
      return {
        ...state,
        loading: payload
      };
    default:
      return state;
  }
}
