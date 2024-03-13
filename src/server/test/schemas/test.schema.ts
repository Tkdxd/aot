import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Test>;

@Schema()
export class Test {
  @Prop()
  name: string;
}

export const TestSchema = SchemaFactory.createForClass(Test);
