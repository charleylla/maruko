import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { %_StoreName_% } from './fname.component.store';
import { IProps } from './fname.interface';
// import style from './fname.component.less';

@inject('%_StoreNameAttr_%')
@observer
export class %_ComponentName_% extends React.Component<IProps> {
  private readonly store: %_StoreName_% = this.props.%_StoreNameAttr_%;
  render(){
    return <div>Hello %_ComponentName_%</div>
  }
}