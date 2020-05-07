import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';

import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import CreateCategoryService from '../services/CreateCategoryService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => { 
  // TODO
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const dataTransactions = await transactionsRepository.find();
  
  const categoriesRepository = getCustomRepository(CategoriesRepository);
  const categories = await categoriesRepository.find();
  
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

const balance = await transactionsRepository.getBalance(transactions);
  
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
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const results = await transactionsRepository.delete(request.params.id);

  return response.send(results)
});

transactionsRouter.post(
  '/import', 
  upload.single('file'),
  async (request, response) => {

  const importTransactions = new ImportTransactionsService();

  const transactions = await importTransactions.execute(request.file.path);

  return response.json(transactions)
});

export default transactionsRouter;
