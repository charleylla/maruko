import * as React from 'react';
import { RoutesService } from '~/framework/util/routes/routes.service';
import { %_RoutesName_% } from './fname.routes';

const %_ModuleName_% = () => {
  return <React.Fragment>{RoutesService.renderRoutes(%_RoutesName_%)}</React.Fragment>;
};

export default %_ModuleName_%
