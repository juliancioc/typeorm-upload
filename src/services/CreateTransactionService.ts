import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Category {
    id?: string,
    title?: string;
    created_at?: Date,
    updated_at?: Date
}

interface Request {
    title: string,
    value: number,
    type: string,
    category?: Category,
}

class CreateTransactionService {
    public async execute({ title, value, type, category }: Request): Promise< Transaction> {
        
        const transactionsRepository = getCustomRepository(TransactionsRepository);
        const transactions = await transactionsRepository.find();
        
        const balance = await transactionsRepository.getBalance(transactions);
        if (type === 'outcome' && value > balance.total) {
            throw new AppError('Balance unvailable')
        }
        
        const transaction = transactionsRepository.create({
            title,
            value,
            type,
            category
        });
        
        await transactionsRepository.save(transaction);
        
        return transaction;
    }
}

export default CreateTransactionService;