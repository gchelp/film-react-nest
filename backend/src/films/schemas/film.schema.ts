import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Session {
  @Prop({ required: true }) id: string;
  @Prop() daytime: string;
  @Prop() hall: number;
  @Prop() rows: number;
  @Prop() seats: number;
  @Prop() price: number;
  @Prop({ type: [String], default: [] }) taken: string[];
}
export const SessionSchema = SchemaFactory.createForClass(Session);

@Schema({ collection: 'films' })
export class Film {
  @Prop({ required: true }) id: string;
  @Prop() rating: number;
  @Prop() director: string;
  @Prop({ type: [String], default: [] }) tags: string[];
  @Prop() title: string;
  @Prop() about: string;
  @Prop() description: string;
  @Prop() image: string;
  @Prop() cover: string;
  @Prop({ type: [SessionSchema], default: [] }) schedule: Session[];
}
export const FilmSchema = SchemaFactory.createForClass(Film);