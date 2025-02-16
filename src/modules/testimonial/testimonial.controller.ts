import { Controller, Get, Post, Body } from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { Tesitmonial } from 'src/model/testimonial/testimonial.model';

@Controller('testimonials')
export class TestimonialController {
  constructor(private readonly testimonialService: TestimonialService) {}

  @Post()
  async create(
    @Body() createTestimonialDto: Tesitmonial,
  ): Promise<Tesitmonial> {
    return this.testimonialService.createTestimonial(createTestimonialDto);
  }

  @Get()
  async findAll(): Promise<Tesitmonial[]> {
    return this.testimonialService.getTestimonials();
  }
}
