import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/user/schemas/user.schema';
import { ExpensesService } from './expenses.service';
import { JwtGuard } from 'src/auth/jwt.guard';
import { TransformedExpenseDto } from './dtos/transform-expense.dto';
import { UpdateExpenseDto } from './dtos/update-expense.dto';
import { ResponseMessage } from 'src/types/response-message.interface';

@Controller('expense')
@UseGuards(JwtGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  async createExpense(
    @GetUser() user: User,
    @Body() createExpenseDto: CreateExpenseDto,
  ): Promise<TransformedExpenseDto> {
    return await this.expensesService.createExpense(user, createExpenseDto);
  }

  @Patch(':id')
  async updateExpense(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ): Promise<TransformedExpenseDto> {
    return await this.expensesService.updateExpense(user, id, updateExpenseDto);
  }

  @Delete(':id')
  async deleteExpense(
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<ResponseMessage> {
    await this.expensesService.deleteExpense(user, id);
    return { message: `Expense '${id} deleted successfully` };
  }
}
