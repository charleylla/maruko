import * as React from 'react';
import { RoutesUtil } from '~/framework/util/routes';
import { %_RoutesName_% } from './fname.routes';

export const %_ModuleName_% = () => {
  return <React.Fragment>{RoutesUtil.renderRoutes(%_RoutesName_%)}</React.Fragment>;
};
