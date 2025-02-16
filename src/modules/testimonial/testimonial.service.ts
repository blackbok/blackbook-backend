import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Tesitmonial,
  TesitmonialDocument,
} from 'src/model/testimonial/testimonial.model';

@Injectable()
export class TestimonialService {
  private readonly logger = new Logger(TestimonialService.name);
  constructor(
    @InjectModel(Tesitmonial.name)
    private testimonialModel: Model<TesitmonialDocument>,
  ) {}

  async getTestimonials(): Promise<any> {
    return await this.testimonialModel.find().exec();
  }

  async createTestimonial(testimonial: Tesitmonial): Promise<Tesitmonial> {
    const createdTestimonial = new this.testimonialModel(testimonial);
    return await createdTestimonial.save();
  }
}
