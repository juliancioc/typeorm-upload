import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import CreateCategoryService from '../services/CreateCategoryService';
import Category from '../models/Category';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  // TODO
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const dataTransactions = await transactionsRepository.find();
  
  const categoriesRepository = getCustomRepository(CategoriesRepository);
  const categories = await categoriesRepository.find();
  
  let initialValueIncome = 0;
  let initialValueOutcome = 0;
  
  const income = dataTransactions
  .filter(({ type }) => type === 'income')
  .reduce((accumulator, currentValue) => accumulator + currentValue.value
  , initialValueIncome
  );
  
  const outcome = dataTransactions
  .filter(({ type }) => type === 'outcome')
  .reduce((acumulator, currentValue) => acumulator + currentValue.value
  , initialValueOutcome);

  const total = income - outcome;
  
  const balance = { income, outcome, total }
 
  const transactions: Array<any> = [];
  
  dataTransactions.forEach((t) => {
    let categoriesTransaction = categories.find(e => e.id === t.category_id);
    
    transactions.push({ 
      id: t.id,
      title: t.title,
      value: t.value,
      type: t.type,
      category: categoriesTransaction,
      created_at: t.created_at,
      updated_at: t.updated_at
    });
  });
  
  return response.json({ transactions, balance })
});

transactionsRouter.post('/', async (request, response) => {
  // TODO
  const { title, value, type, category } = request.body;
  
  const createTransaction = new CreateTransactionService();
  
  const createCategory = new CreateCategoryService();
  const categoriesRepository = getCustomRepository(CategoriesRepository);
  const categories = await categoriesRepository.find();
  
  let findCategory;
  
  if(categories) {
    findCategory = categories.find(c => c.title === category);
    
    if(!findCategory) {
      findCategory = await createCategory.execute({
        title: category
      });
      
    } 
  } else {
    findCategory = await createCategory.execute({
      title: category
    });
    
    
  }
  
  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category: {
      id: findCategory.id,
      title: findCategory?.title,
      created_at: findCategory.created_at,
      updated_at: findCategory.updated_at
    }
  });
  
  delete transaction.category_id
  
  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
