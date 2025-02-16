import { Module } from '@nestjs/common';
import { TestimonialController } from './testimonial.controller';
import { TestimonialService } from './testimonial.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Tesitmonial,
  TesitmonialSchema,
} from 'src/model/testimonial/testimonial.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tesitmonial.name, schema: TesitmonialSchema },
    ]),
  ],
  controllers: [TestimonialController],
  providers: [TestimonialService],
})
export class TestimonialModule {}
