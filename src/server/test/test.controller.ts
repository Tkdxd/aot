import { Body, Controller, Post, Req } from '@nestjs/common';
import { TestService } from './test.service';
import { ScriptInputDto } from './dto/script-input.dto';

@Controller('/api/test')
export class TestController {
  constructor(private testService: TestService) {}

  // @Get()
  // async get() {
  //   const data = await this.testService.test1();
  //   console.log(data);
  //   return data;
  // }

  @Post()
  async post(@Req() req: Request, @Body() data: ScriptInputDto) {
    const res = await this.testService.test(req, data);
    // const res = await this.testService.test2();
    return res;
  }
}
