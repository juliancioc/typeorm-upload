import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import CreateCategoryService from '../services/CreateCategoryService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  // TODO
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find()
  
  return response.json(transactions)
});

transactionsRouter.post('/', async (request, response) => {
  // TODO
  const { title, value, type, category } = request.body;
  const createTransaction = new CreateTransactionService();
  const createCategory = new CreateCategoryService();
  const categoriesRepository = getCustomRepository(CategoriesRepository);
  const categories = await categoriesRepository.find();
  let idCategory;
  
  if(categories) {
    const findCategory = categories.find(c => c.title === category);

    idCategory = findCategory?.id
    
    if(!findCategory) {
      const newCategory = await createCategory.execute({
        title: category
      });
      
      idCategory = newCategory.id
    } 
  } else {
    const newCategory = await createCategory.execute({
      title: category
    });
    
    idCategory = newCategory.id
  }
  
  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category_id: idCategory
  });
  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
