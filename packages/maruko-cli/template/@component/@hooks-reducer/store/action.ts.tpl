import { TYPES } from './type';

// 设置 loading
export function setLoadingAction(payload: boolean) {
  return {
    type: TYPES.SET_LOADING,
    payload
  };
}
