import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { TodoDocument } from './schema/todo.schema';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel('Todo')
    private readonly todoModel: Model<TodoDocument>,
  ) {}

  async createTodo(user: string, text: string): Promise<TodoDocument> {
    const newProduct = new this.todoModel({ user, text });
    return newProduct.save();
  }

  async findAllTodos(userId: string): Promise<TodoDocument[]> {
    return this.todoModel.find({ user: userId }).exec();
  }

  async updateTodo(
    text: string,
    completed: boolean,
    todoId: string,
    userId: string,
  ): Promise<TodoDocument> {
    return this.todoModel
      .findByIdAndUpdate(
        todoId,
        {
          userId,
          text,
          completed,
        },
        { new: true },
      )
      .exec();
  }

  async deleteTodo(todoId: string, userId: string) {
    const todo = await this.todoModel.findById(todoId);

    if (!todo) {
      return 'Todo not found';
    }

    if (todo.user.toString() !== userId) {
      return 'You are not authorized to update this todo';
    }

    return this.todoModel.deleteOne({ _id: todoId }).exec();
  }
}
