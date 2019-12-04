import { useRef } from 'react';
import { IProps, IState } from './fname.interface';
import { setLoadingAction } from './store/action';
import { ReducerStore } from '~/framework/aop/hooks/base-store';

export class %_StoreName_% extends ReducerStore<IState> {
  constructor(readonly props: IProps) {
    super(props);
  }

  // 初始化 ref
  useRefs = () => {
    const yourRefVariable = useRef(null);
    return {
      yourRefVariable
    };
  };

  setLoading = () => {
    const { loading } = this.state;
    this.dispatch(setLoadingAction(!loading));
  };
}
