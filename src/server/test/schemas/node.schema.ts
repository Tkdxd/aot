import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Node>;

@Schema()
export class Node {
  @Prop({ required: true })
  id: number;

  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Node' })
  successOutput: Node;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Node' })
  failedOutputId: Node;

  @Prop()
  config: string;
}

export const NodeSchema = SchemaFactory.createForClass(Node);
