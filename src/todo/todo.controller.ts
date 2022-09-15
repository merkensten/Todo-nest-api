import { JwtGuard } from './../auth/guards/jwt.guard';
import { TodoService } from './todo.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TodoDocument } from './schema/todo.schema';

@Controller('todo')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @UseGuards(JwtGuard)
  @Post()
  createTodo(
    @Body('user') user: string,
    @Body('text') text: string,
  ): Promise<TodoDocument> {
    return this.todoService.createTodo(user, text);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findTodos(@Param('id') id: string): Promise<TodoDocument[]> {
    return this.todoService.findAllTodos(id);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  updateTodo(
    @Body('text') text: string,
    @Body('completed') completed: boolean,
    @Param('id') todoId: string,
    @Query('user') user: string,
  ): Promise<TodoDocument> {
    return this.todoService.updateTodo(text, completed, todoId, user);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteTodo(@Param('id') todoId: string, @Query('userId') userId: string) {
    return this.todoService.deleteTodo(todoId, userId);
  }
}
