import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectContext } from 'nest-puppeteer';
import { BrowserContext } from 'puppeteer';

@Injectable()
export class UsersService {
  constructor(
    @InjectContext() private readonly browserContext: BrowserContext,
  ) {}
  create(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async get() {
    const page = await this.browserContext.newPage();
    await page.goto('https://test.com/');
    return await page.content();
  }
}
