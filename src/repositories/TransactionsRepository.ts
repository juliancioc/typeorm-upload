import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {

  public async getBalance(income: number, outcome: number, total: number): Promise<Balance> {
    // TODO
    const balance = await this.getBalance(income, outcome, total);
    
    return balance || null;
  }  
}

export default TransactionsRepository;
