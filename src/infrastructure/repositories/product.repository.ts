import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Like, Not, Repository } from 'typeorm';
import { ProductName } from '../../domain/entities/productName.entity';
import { IProductRepository } from 'src/application/interfaces/IProduct.repository';
import { Description } from 'src/domain/entities/description.entity';
import { Logger, NotFoundException } from '@nestjs/common';
import { UpdateProductDto } from 'src/application/dto/updateProduct.dto';
import { UpdateDesDto } from 'src/application/dto/updateDes.dto';
import { CreateProductDto } from 'src/application/dto/createProduct.dto';
import { PopularProductDto } from 'src/application/dto/createPopularProduct.dto';
import { AttachmentEntity } from 'src/domain/entities/attachment.entity';
import { Features } from 'src/domain/entities/features.entity';
import { SubDetailDetails } from 'src/domain/entities/subDetailDetails.entity';
import { ProductSubDetailDetails } from 'src/domain/entities/productSubDetailDetails.entity';
import { ProductDetail } from 'src/domain/entities/productDetail.entity';

export class ProductRepository implements IProductRepository {
  private readonly logger = new Logger();

  constructor(
    @InjectRepository(ProductName)
    private readonly productRepository: Repository<ProductName>,

    @InjectRepository(Description)
    private readonly desRepo: Repository<Description>,

    @InjectRepository(AttachmentEntity)
    private readonly attachmentRepo: Repository<AttachmentEntity>,

    @InjectRepository(Features)
    private readonly featureRepo: Repository<Features>,

    @InjectRepository(ProductDetail)
    private readonly productDetail: Repository<ProductDetail>,
  ) {}

  async getProduct(id: number): Promise<ProductName | null> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        attachments: true,
        des: true,
      },
    });

    if (product) {
      product.attachments = product.attachments.filter(
        (att) => att.attachmentType === 'img',
      );
    }
    return product;

    //     const query = `SELECT
    // 	pn.name as productName,
    // 	pn.id as productId,
    // 	pn.en_name ,
    // 	pn.code,
    //   ae.ext,
    //   ae."fileName",
    //   ae."attachmentType",
    //   de.content
    // 	 from product_names pn
    // 	join attachment_entity ae on (ae."fileName" = pn.code or ae.product_id = pn.id) and ae."attachmentType" = 'img'
    // 	join description de on de.id = pn."desId" or de.id = pn.id
    //   where pn.id = ANY($1::int[])
    // `;
    // const product = await this.productRepository.query(query, [[id]]);
  }

  async getAllProduct(): Promise<ProductName[]> {
    //   const productsQuery = `
    //   SELECT DISTINCT ON (pn.id)
    //     pn.id,
    //     pn.code,
    //     pn."categoryId",
    //     ca.title_per,
    //     pn."name",
    //     pn."subcategoryId",
    //     sc.title,
    //     pn.en_name,
    //     ae."attachmentType",
    //     ae.ext,
    //     ae.product_id
    //   FROM product_names pn
    //   JOIN categories ca ON ca.id = pn."categoryId"
    //   JOIN sub_categories sc ON sc.id = pn."subcategoryId"
    //   JOIN attachment_entity ae ON ae.product_id = pn.id
    //   ORDER BY pn.id ASC;
    // `;

    //   const featuresQuery = `
    //   SELECT
    //     fp."productId",
    //     fe.title,
    //     fp.id AS "featureId"
    //     FROM feature_product fp
    //     JOIN product_names pn ON fp."productId" = pn.id
    //     JOIN features fe ON fe.id = fp."featureId";
    // `;

    //   const [products, features] = await Promise.all([
    //     this.productRepository.query(productsQuery),
    //     this.productRepository.query(featuresQuery),
    //   ]);

    //   const featureMap = new Map<number, any[]>();

    //   for (const feature of features) {
    //     if (!featureMap.has(feature.productId)) {
    //       featureMap.set(feature.productId, []);
    //     }
    //     featureMap.get(feature.productId)!.push(feature);
    //   }
    //   const result = products.map((item: any) => ({
    //     id: item.id,
    //     code: item.code,
    //     name: item.name,
    //     categoryId: item.categoryId,
    //     categoryTitle: item.title_per,
    //     subcategoryId: item.subcategoryId,
    //     subcategoryTitle: item.title,
    //     en_name: item.en_name,

    //     attachments: [
    //       {
    //         ext: item.ext,
    //         attachmentType: item.attachmentType,
    //       },
    //     ],

    //     features: featureMap.get(item.id) || [],
    //   }));

    return await this.productRepository.find({
      relations: ['attachments', 'features', 'des'],
      order: {
        id: 'asc',
      },
      where: {
        position: Not(IsNull()),
      },
    });
  }

  async getDesById(code: number): Promise<Description | null> {
    return await this.desRepo.findOne({
      where: { id: code },
    });
  }

  async getProductBySearch(
    productTitle: string,
    productModel: number,
  ): Promise<ProductName[]> {
    if (
      !productTitle ||
      productTitle.trim() === '' ||
      productTitle === 'null'
    ) {
      return [];
    }

    let products = await this.productRepository.find({
      where: {
        name: Like(`${productTitle}%`),
      },
      order: {
        id: 'DESC',
      },
    });

    if (products.length === 0) {
      products = await this.productRepository.find({
        where: {
          name: Like(`%${productTitle}%`),
        },
        order: {
          id: 'DESC',
        },
      });
    }

    return products.map((product) => ({
      ...product,
      attachments:
        product.attachments?.filter(
          (attachment) => attachment.attachmentType === 'img',
        ) || [],
    }));
  }

  async getNewProduct(): Promise<ProductName[]> {
    const query = `
select * from public.attachment_entity ae
	join product_names pn on ae."fileName" = pn.code
	where ae."attachmentType" = 'new'
  `;
    const res = await this.productRepository.query(query);

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

  async deleteNewProduct(code: string | number): Promise<void> {
    const attachment = await this.attachmentRepo.findOne({
      where: { fileName: code.toString(), attachmentType: 'new' },
    });

    if (!attachment) {
      throw new NotFoundException('محصول پیدا نشد');
    }

    await this.attachmentRepo.remove(attachment);
  }

  async deleteCoverProduct(productId: number): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['attachments'],
    });

    if (!product) {
      throw new NotFoundException('محصول پیدا نشد');
    }
    await this.productRepository.remove(product);
  }

  async deleteNormalProduct(code: string | number): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { code: code.toString() },
      relations: ['attachments', 'features', 'des'],
    });

    if (!product) {
      throw new NotFoundException('محصول پیدا نشد');
    }
    await this.productRepository.remove(product);
  }

  async getProductPopular(): Promise<ProductName[]> {
    // const codes = ['3410', '7740', '7742', '9166'];
    // const query = `
    // SELECT *,
    // json_build_array(
    //   json_build_object(
    //     'ext', ae.ext,
    //     'fileName', ae."fileName",
    //     'attachmentType', ae."attachmentType"
    //   )
    // ) as attachments
    // FROM product_names pn
    // JOIN attachment_entity ae ON ae.product_id = pn.id
    // join description de on de.id = pn.id
    // WHERE pn.code = ANY($1)
    // AND ae."attachmentType" = 'pop'`;

    const query = `
select pn.id as productId , pn.code ,pn.name ,  pn."categoryId" , pn."subcategoryId" , ae."attachmentType" , ae.ext , ae."fileName"  from product_names pn
	join attachment_entity ae on ae."fileName" = pn.code or ae.product_id = pn.id
	where ae."attachmentType" = 'pop'`;

    const res = await this.productRepository.query(query);

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

  async updateProduct(
    productId: string,
    dto: UpdateProductDto,
  ): Promise<ProductName> {
    const fixProductId = Number(productId);

    const product = await this.productRepository.findOne({
      where: { id: fixProductId },
    });
    if (!product) {
      throw new Error('محصول یافت نشد');
    }
    Object.assign(product, dto);

    return await this.productRepository.save(product);
  }

  async updateDesProduct(
    productId: string,
    updateDesDto: UpdateDesDto,
  ): Promise<Description | null> {
    const fixProductId = Number(productId);

    const des = await this.desRepo.findOne({
      where: { id: fixProductId },
    });
    if (!des) {
      throw new Error('محصول یافت نشد');
    }
    Object.assign(des, updateDesDto);
    return await this.desRepo.save(des);
  }

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductName> {
    const product = this.productRepository.create({
      name: createProductDto.name,
      position: createProductDto.position,
      en_name: createProductDto.en_name,
      code: createProductDto.code,
      categoryId: createProductDto.categoryId,
      subcategoryId: createProductDto.subcategoryId,
      title: createProductDto.title,
      des: createProductDto.des,
      features:
        createProductDto.features?.map((feature: any) => ({
          title: feature.title,
        })) || [],
    });
    console.log('createProductDtocreateProductDto', createProductDto);

    if (createProductDto.features.length > 0) {
      const features = createProductDto.features?.map((featureDto: any) => {
        return this.featureRepo.create({
          title: featureDto.title,
        });
      });

      await this.featureRepo.save(features);
    }

    const savedProduct = await this.productRepository.save(product);
    return await savedProduct;
  }

  async createPopularProduct(
    papularDto: PopularProductDto,
  ): Promise<ProductName> {
    const product = this.productRepository.create({
      name: papularDto.name,
      code: papularDto.code,
    });
    const savedProduct = await this.productRepository.save(product);
    return await savedProduct;
  }

  async getMainCover(): Promise<ProductName[]> {
    //   const query = `
    // select *
    //   from product_names pn
    //   join attachment_entity ae on ae.product_id = pn.id
    //   where ae."attachmentType" = 'cov'
    //   order by pn.main_image`;
    const result = await this.productRepository.find({
      relations: ['attachments'],
      where: {
        attachments: {
          attachmentType: 'cov',
        },
      },
      order: {
        position: 'ASC',
      },
    });
    // const res = await this.productRepository.query(result);
    return result;
  }

  async createCover(coverData: any): Promise<ProductName> {
    const product = this.productRepository.create({
      name: coverData.name,
      en_name: coverData.en_name,
      code: coverData.code,
      categoryId: coverData.categoryId,
      subcategoryId: coverData.subcategoryId,
      title: coverData.title,
      redirect: coverData.redirect,
    });
    const savedProduct = await this.productRepository.save(product);
    return savedProduct;
  }

  async deletePopularProduct(productId: number): Promise<void> {
    try {
      const product = await this.productRepository.findOne({
        where: { id: productId },
        relations: ['attachments'],
      });

      if (!product) {
        throw new NotFoundException('محصول پیدا نشد');
      }

      if (product.code) {
        await this.attachmentRepo
          .createQueryBuilder()
          .delete()
          .from(AttachmentEntity)
          .where('fileName = :code', { code: product.code })
          .orWhere('product_id = :productId', { productId: productId })
          .execute();
      } else {
        await this.attachmentRepo.delete({
          product: { id: productId },
        });
      }
      await this.productRepository.delete(productId);
      this.logger.log(`محصول با ID ${productId} و attachmentهای مرتبط پاک شد`);
    } catch (error) {
      this.logger.error(`خطا در حذف محصول ${productId}:`, error);
      throw error;
    }
  }

  async createDetailSubDetail(data: any[]): Promise<void> {
    const productId = data[0]?.productId;

    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['productDetails'],
    });

    if (!product) throw new Error('Product not found');

    product.productDetails = data.flatMap((item) =>
      item.subDetailes.map((subId) => ({
        product: { id: product.id },
        detail: { id: item.detailId },
        subDetail: { id: subId },
      })),
    );
    await this.productRepository.save(product);
  }

  async filterProduct(data: any): Promise<any> {
    console.log('VVVVVVVVVVVVVVVV', data);

    const ids = data?.subDetailes;
    const subCategoryId = data?.subCategoryId;

    const res = await this.productRepository.find({
      where: {
        subcategoryId: subCategoryId,
        productDetails: {
          subDetail: {
            id: In(ids),
          },
        },
      },
      relations: [
        'productDetails',
        'productDetails.subDetail',
        'productDetails.detail',
        'attachments',
        'features',
      ],
    });

    console.log('resresresres', res);

    return res;
  }

  // ترنس اکشننننننننننننننننننننن
  //   async createDetailSubDetail(data: any[]): Promise<void> {
  //   await this.productRepository.manager.transaction(async (manager) => {
  //     for (const item of data) {
  //       const { detailId, productId, subDetailes } = item;

  //       for (const subDetailId of subDetailes) {
  //         const subDetailDetail = manager.create(SubDetailDetails, {
  //           detailId,
  //           subDetailId,
  //         });

  //         const saved = await manager.save(subDetailDetail);

  //         const productSubDetail = manager.create(ProductSubDetailDetails, {
  //           productId,
  //           subDetailDetailId: saved.id,
  //         });

  //         await manager.save(productSubDetail);
  //       }
  //     }
  //   });
  // }
}

//  async createProduct(createProductDto: CreateProductDto): Promise<any> {
//     const queryRunner =
//       this.productRepository.manager.connection.createQueryRunner();

//     await queryRunner.connect();
//     await queryRunner.startTransaction();

//     try {
//       // 1. ایجاد محصول اصلی (بدون ویژگی‌ها)
//       const product = this.productRepository.create({
//         name: createProductDto.name,
//         en_name: createProductDto.en_name,
//         code: createProductDto.code,
//         categoryId: createProductDto.categoryId,
//         subcategoryId: createProductDto.subcategoryId,
//         title: createProductDto.title,
//       });

//       const savedProduct = await queryRunner.manager.save(product);

//       // 2. ایجاد توضیحات اگر وجود دارد
//       if (createProductDto.des?.content) {
//         const description = this.desRepo.create({
//           content: createProductDto.des.content,
//         });
//         await queryRunner.manager.save(description);
//       }

//       // 3. ایجاد ویژگی‌ها و ارتباط آنها
//       if (createProductDto.features?.length > 0) {
//         const validFeatures = createProductDto.features.filter((f: any) =>
//           f.title?.trim(),
//         );

//         for (const featureDto of validFeatures as any) {
//           // ایجاد ویژگی جدید
//           const feature = new Features();
//           feature.title = featureDto.title;

//           const savedFeature = await queryRunner.manager.save(feature);

//           // ایجاد ارتباط در جدول feature_product
//           const featureProduct = new FeatureProductEntity();
//           featureProduct.featureId = savedFeature.id;
//           featureProduct.productId = savedProduct.id;

//           await queryRunner.manager.save(featureProduct);
//         }
//       }

//       await queryRunner.commitTransaction();

//       return {
//         id: savedProduct.id,
//         message: 'محصول با موفقیت ایجاد شد',
//         code: 0,
//       };
//     } catch (error) {
//       await queryRunner.rollbackTransaction();
//       this.logger.error('خطا در ایجاد محصول:', error);

//       // بررسی دقیق‌تر خطا
//       if (error.code === '23505') {
//         // خطای unique constraint
//         throw new ConflictException('رکورد تکراری وجود دارد');
//       }

//       throw new InternalServerErrorException('خطا در ایجاد محصول');
//     } finally {
//       await queryRunner.release();
//     }
//   }
