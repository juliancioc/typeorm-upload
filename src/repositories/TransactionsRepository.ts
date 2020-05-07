import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  
  public async getBalance(transactions?: any): Promise<any> {
    // TODO  
    let initialValueIncome = 0;
    let initialValueOutcome = 0;

    const income = transactions
      .filter(({ type }: any) => type === 'income')
      .reduce((accumulator: any, currentValue: any) => accumulator + currentValue.value
        , initialValueIncome
      );

    const outcome = transactions
      .filter(({ type }: any) => type === 'outcome')
      .reduce((acumulator: any, currentValue: any) => acumulator + currentValue.value
        , initialValueOutcome)

    const total = income - outcome;
    const balance: any = { income, outcome, total }

    return balance;
  }  
}

export default TransactionsRepository;
