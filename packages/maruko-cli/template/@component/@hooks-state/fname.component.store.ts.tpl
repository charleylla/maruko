import { %_HooksStateInterfaceName_% } from './fname.interface';
import { useStateStore } from '~/framework/aop/hooks/base-store';

export function %_HooksStateStoreName_%() {
    const { state, setStateWrap } = useStateStore(new %_HooksStateInterfaceName_%());
    return { state }
}