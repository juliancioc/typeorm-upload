import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
    title: string;
    type: string;
    value: number;
    category: string
}

class CreateTransactionService {
    public async execute({ title, type, value, category }: Request): Promise< Transaction> {
        const transactionsRepository = getCustomRepository(TransactionsRepository);

        const transaction = transactionsRepository.create({
            title,
            type,
            value,
            category
        })

        await transactionsRepository.save(transaction);

        return transaction;
    }
}

export default CreateTransactionService;