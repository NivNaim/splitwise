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
import { getUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/user.schema';
import { ExpensesService } from './expenses.service';
import { JwtGuard } from 'src/auth/jwt.guard';
import { TransformedExpenseDto } from './dtos/transform-expense.dto';
import { UpdateExpenseDto } from './dtos/update-expense.dto';

@Controller('expense')
@UseGuards(JwtGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  async createExpense(
    @getUser() user: User,
    @Body() createExpenseDto: CreateExpenseDto,
  ): Promise<TransformedExpenseDto> {
    return await this.expensesService.createExpense(user, createExpenseDto);
  }

  @Patch(':id')
  async updateExpense(
    @getUser() user: User,
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ): Promise<TransformedExpenseDto> {
    return await this.expensesService.updateExpense(user, id, updateExpenseDto);
  }

  @Delete(':id')
  async deleteExpense(
    @getUser() user: User,
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    await this.expensesService.deleteExpense(user, id);
    return { message: `Expense '${id} deleted successfully` };
  }
}
