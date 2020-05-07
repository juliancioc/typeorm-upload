import csvParse from 'csv-parse';
import fs from 'fs';
import Transaction from '../models/Transaction';

import { In, getRepository, getCustomRepository } from 'typeorm';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {

    const contactsReadStream = fs.createReadStream(filePath);

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    
    const categoriesRepository = getRepository(Category);

    const parsers = csvParse({
      from_line: 2,
    })
    
    const parseCSV = contactsReadStream.pipe(parsers);
    
    const transactions: any = [];
    const categories: any = [];
    
    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) => 
      cell.trim()
      );
      if(!title || !type || !value) return;

      categories.push(category);

      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categories)
      }
    });

    const existentCategoriesTitle = existentCategories.map(
      (category: Category) => category.title,
    );

    const addCategoryTitles = categories
    .filter((category: any) => !existentCategoriesTitle.includes(category))
    .filter((value: any, index: any, self: any) => self.indexOf(value) == index);

      const newCategories = categoriesRepository.create(
        addCategoryTitles.map((title: string) => ({
          title
        })),
      );

      await categoriesRepository.save(newCategories);

      const finalCategories = [...newCategories, ...existentCategories]

      const createdTransactions = transactionsRepository.create(
        transactions.map((transaction: any) => ({
          title: transaction.title,
          type: transaction.type,
          value: transaction.value,
          category: finalCategories.find(
            (category: any) => category.title === transaction.category,
          ),
        })),
      );

      await transactionsRepository.save(createdTransactions);

      await fs.promises.unlink(filePath);

      return createdTransactions;
  }
}

export default ImportTransactionsService;
