import { Injectable } from '@nestjs/common';
import { Categories } from '../../domain/entities/categories.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductName } from '../../domain/entities/productName.entity';
import { ICategoryRepository } from 'src/application/interfaces/ICategory.repository';
import { SubCategories } from 'src/domain/entities/subCategories.entity';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(Categories)
    private readonly category: Repository<Categories>,
    @InjectRepository(SubCategories)
    private readonly subCategories: Repository<SubCategories>,
    @InjectRepository(ProductName)
    private readonly product: Repository<ProductName>,
  ) {}

  async getAllCategoryList(): Promise<Categories[]> {
    const query = `
select title_per as categoryName , ae."attachmentType" , ext , code , pn.id , ca.id as categoryId
from categories ca
join attachment_entity ae on ca."attachId" = ae.id 
join product_names pn on pn.id = ae.product_id 
order by ca.id asc


    `;
    const res = await this.category.query(query);

    return res;
  }

  async getSubCategoriesBySubcategoryId(
    subCategoryId: number,
  ): Promise<ProductName[]> {
    // return await this.product
    //   .createQueryBuilder('pn')
    //   .leftJoinAndSelect('pn.attachments', 'ae')
    //   .where('pn.subcategoryId = :subCategoryId', {
    //     subCategoryId,
    //   })
    //   .getMany();
    const query = `
  select DISTINCT on (pn.id)
  pn.id as productId , 
  pn.name , 
  pn.en_name,
  pn.code,
  ae.ext,
  ae."fileName",
  ae."attachmentType"
from product_names pn
join attachment_entity ae
  on pn.id = ae.product_id or pn.code = ae."fileName"
where pn."subcategoryId" = ANY($1::int[])
and ae."attachmentType" = 'img'
order by pn.id
`;
    const res = await this.product.query(query, [[subCategoryId]]);
    const fixRes = res.map((item: any) => ({
      ...item,
      attachments: [
        {
          ext: item?.ext,
          code: item?.code,
          attachmentType: item?.attachmentType,
        },
      ],
    }));
    return fixRes;
  }

  async getCategoryById(categoryId: number): Promise<SubCategories[]> {
    // const query = `
    //   select * from sub_categories
    //     where  sub_categories."categoryId" = $1

    // `;
    // return await this.category.query(query, [categoryId]);
    const res = await this.subCategories.find({
      where: { categoryId: categoryId },
    });
    return res;
  }
}
