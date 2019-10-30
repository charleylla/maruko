
import { %_DtoName_%DTO, ExampleRequestParam, ExampleResponseResult } from '%_DtoPath_%';
import { RequestService } from '~/framework/util/base-http/request.service';
import { Observable } from 'rxjs';
import { DepUtil } from '~/framework/aop/inject';

/**
 * 真实开发中，请将示例代码移除
 */

const EXAMPLE_API_PATH: string = 'your-http-request-path';

@DepUtil.Injectable()
export class %_ServiceName_% extends %_DtoName_%DTO {
  @DepUtil.Inject(RequestService)
  private readonly requestService: RequestService;
  constructor() {
    super();
  }

  example(params: ExampleRequestParam): Observable<ExampleResponseResult> {
    return this.requestService.get(EXAMPLE_API_PATH, params);
  }
}