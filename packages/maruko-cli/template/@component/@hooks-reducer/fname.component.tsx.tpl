import React, { useEffect } from 'react';
import { %_StoreName_% } from './fname.component.store';
import { IProps, IState } from './fname.interface';
import style from './fname.component.less';
import { useStore } from '~/framework/aop/hooks/base-store';
import { reducer, initialState } from './store/reducer';

export default function %_ComponentName_%(props: IProps) {
  // 初始化 store
  const store: %_StoreName_% = useStore(%_StoreName_%, props);
  const { state } = store.useReducer<IState>(reducer, initialState);
  // 获取 ref
  const { yourRefVariable } = store.useRefs();

  //  初始化操作
  useEffect(() => {
    setTimeout(() => {
      yourRefVariable.current.style.color = 'red';
    }, 500);
  }, []);

  return (
    <div className={style.box} ref={yourRefVariable}>
      <h3>%_ComponentName_% 示例页面</h3>
      {state.loading ? '%_ComponentName_% is loading...' : '%_ComponentName_% loaded successfully.'}
      <button onClick={store.setLoading}>切换 Loading 状态</button>
    </div>
  );
}
