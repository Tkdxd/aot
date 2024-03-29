import { Controller, Get, Res, Req } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ViewService } from './view.service';

@Controller('/v')
export class ViewController {
  constructor(private viewService: ViewService) {}

  @Get('*')
  static(@Req() req: Request, @Res() res: Response) {
    const handle = this.viewService.getNextServer().getRequestHandler();
    handle(req, res);
  }
}
