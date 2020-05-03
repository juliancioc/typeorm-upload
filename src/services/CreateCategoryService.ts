import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Category from '../models/Category';
import CategoriesRepository from '../repositories/CategoriesRepository';

interface Request {
    title: string,
}

class CreateTransactionService {
    public async execute({ title }: Request): Promise< Category> {
        const categoriesRepository = getCustomRepository(CategoriesRepository);
        const category = categoriesRepository.create({
           title,
        });
        
        await categoriesRepository.save(category);
        
        return category;
    }
}

export default CreateTransactionService;