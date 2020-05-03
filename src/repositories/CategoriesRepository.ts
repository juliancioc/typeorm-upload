import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

interface Request {
  title: string
}

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async getCategories(): Promise<Request> {
    // TODO
    const categories = await this.getCategories();

    return categories;
  }
}

export default CategoriesRepository;
