import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { getUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/user.schema';
import { ExpensesService } from './expenses.service';
import { JwtGuard } from 'src/auth/jwt.guard';
import { TransformedExpenseDto } from './dtos/transform-expense.dto';

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
}
