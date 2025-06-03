import { Controller, Request, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, ClassSerializerInterceptor, ParseIntPipe, BadRequestException, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieTitleValidationPipe } from './pipe/movie-title-validation.pipe';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('movie')
@UseInterceptors(ClassSerializerInterceptor) // class transformer를 여기 controller에 적용하겠다. 
export class MovieController {
  constructor(private readonly movieService: MovieService) { }

  @Get()
  getMovies(
    // @Request() req: any,
    @Query('title', MovieTitleValidationPipe) title?: string,
  ) {
    // console.log(req.user);
    // title 쿼리의 타입이 string 타입인지? 
    return this.movieService.findAll(title);
  }

  @Get(':id')
  getMovie(@Param('id', new ParseIntPipe({
    exceptionFactory(e) {
      throw new BadRequestException('숫자를 입력해주세요');
    },
  })) id: number) {
    // console.log(typeof id); ParseIntPipe 안하면 string으로 나옴 
    return this.movieService.findOne(id);
  }

  @Post()
  //@UseGuards(AuthGuard)
  postMovie(
    @Body() body: CreateMovieDto
  ) {
    return this.movieService.create(
      body
    );
  }

  @Patch(':id')
  patchMovie(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateMovieDto
  ) {

    return this.movieService.update(id, body);
  }

  @Delete(':id')
  deleteMovie(@Param('id', ParseIntPipe) id: number) {
    return this.movieService.remove(id);
  }
}
