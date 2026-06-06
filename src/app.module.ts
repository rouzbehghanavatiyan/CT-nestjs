import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
<<<<<<< HEAD
import { LoggerMiddleware } from './shared/middleware/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/dbTypeorm.config';
import { ChatEntity } from './modules/chat/chat.entity';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { ChatModule } from './modules/chat/chat.module';
import { SocketModule } from './modules/socket/socket.module';
import { StoreModule } from './modules/store/store.module';
import { FileModule } from './modules/File/file.module';

@Module({
  imports: [
=======
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Description } from './domain/entities/description.entity.js';
import { Categories } from './domain/entities/categories.entity.js';
import { SubCategories } from './domain/entities/subCategories.entity.js';
import { LoggerMiddleware } from './presentation/middlewares/logger.middleware.js';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AttachmentEntity } from './domain/entities/attachment.entity.js';
import { ProductName } from './domain/entities/productName.entity.js';
import { Features } from './domain/entities/features.entity.js';
import { CategoryRepository } from './infrastructure/repositories/category.repository.js';
import { FeatureRepository } from './infrastructure/repositories/features.repository.js';
import { ProductRepository } from './infrastructure/repositories/product.repository.js';
import { GetProductCategoryRepository } from './infrastructure/repositories/productCategory.repository.js';
import { GetSubCategoriesBySubcategoryIdUseCase } from './application/use-cases/getSubCategoriesBySubcategoryId.use-case.js';
import { GetProductCategoryUseCase } from './application/use-cases/getProductCategory-use-case.js';
import { GetMainCoverUseCase } from './application/use-cases/getMainCover.use-case.js';
import { GetProductUseCase } from './application/use-cases/getProduct.use-case.js';
import { CreateFeatureUseCase } from './application/use-cases/createFeatures.use-case.js';
import { GetSubCategoriesUseCase } from './application/use-cases/getSubCategories.use-case.js';
import { CategoryController } from './presentation/controllers/category.controller.js';
import { FeatureController } from './presentation/controllers/feature.controller.js';
import { ProductController } from './presentation/controllers/product.controller.js';
import { REPOSITORY_TOKENS } from './application/constants/tokens.js';
import { GetAllFeatureUseCase } from './application/use-cases/getAllFeature.use-case.js';
import { CreateFeatureProductUseCase } from './application/use-cases/createFeatureProduct.use-case.js';
import { FeatureProductEntity } from './domain/entities/featureProduct.entity.js';
import { GetDesByIdUseCase } from './application/use-cases/getDesById.use-case.js';
import { GetFeaturesFromProductUseCase } from './application/use-cases/getFeaturesFromProduct.use-case.js';
import { GetProductBySearchUseCase } from './application/use-cases/getProductBySearch.use-case.js';
import { GetNewProductUseCase } from './application/use-cases/getNewProduct.use-case.js';
import { GetPopularProductUseCase } from './application/use-cases/getPopularProduct.use-case.js';
import { GetCategoryByIdUseCase } from './application/use-cases/getSubCategoryById.use-case.js';
import { DeleteNewProductUseCase } from './application/use-cases/deleteNewProduct.use-case.js';
import { AttachmentController } from './presentation/controllers/attachment.controller.js';
import { AddAttachmentUseCase } from './application/use-cases/addAttachment.use-case.js';
import { AttachmentRepository } from './infrastructure/repositories/attachment.repository.js';
import { GetAllProductUseCase } from './application/use-cases/getAllProduct.use-case.js';
import { UpdateProductUseCase } from './application/use-cases/updateProduct.use-case.js';
import { UpdateDesUseCase } from './application/use-cases/updateDesProduct.use-case.js';
import { CreateProductUseCase } from './application/use-cases/createProduct.use-case.js';
import { CreatePopularProductUseCase } from './application/use-cases/createPopularProduct.use-case.js';
import { DeleteCoverProductUseCase } from './application/use-cases/deleteCoverProduct.use-case.js';
import { DeleteNormalProductUseCase } from './application/use-cases/deleteNormalProduct.use-case.js';
import { DeletePopularProductUseCase } from './application/use-cases/deletePopularProduct.use-case.js';
import { SubCategoryController } from './presentation/controllers/subCategory.controller.js';
import { GetAllSubCategoriesUseCase } from './application/use-cases/getAllSubCategories.use-case.js';
import { SubCategoryRepository } from './infrastructure/repositories/subCategory.repository.js';
import { CreateCoverUseCase } from './application/use-cases/createCover.use-case.js';
import { AddtionallController } from './presentation/controllers/addtional.controller.js';
import { AddtionalRepository } from './infrastructure/repositories/addtional.repository.js';
import { GetMoreImagesUseCase } from './application/use-cases/getMoreImages.use-case.js';
import { Details } from './domain/entities/details.entity.js';
import { SubDetails } from './domain/entities/subDetails.entity.js';
import { ProductSubDetailDetails } from './domain/entities/productSubDetailDetails.entity.js';
import { SubDetailDetails } from './domain/entities/subDetailDetails.entity.js';
import { DetailController } from './presentation/controllers/detail.controller.js';
import { CreateDetailUseCase } from './application/use-cases/createDetail.use-case.js';
import { DetailRepository } from './infrastructure/repositories/detail.repository.js';
import { GetAllDetailsUseCase } from './application/use-cases/getAllDetails.use-case.js';
import { GetAllSubDetailsUseCase } from './application/use-cases/getAllSubDetails.use-case.js';
import { SubDetailRepository } from './infrastructure/repositories/subDetails.repository.js';
import { CreateSubDetailsUseCase } from './application/use-cases/createSubDetails.use-case.js';
import { SubDetailsController } from './presentation/controllers/subDetails.controller.js';
import { CreateDetailSubDetailUseCase } from './application/use-cases/createDetailSubDetail.use-case.js';
import { ProductDetail } from './domain/entities/productDetail.entity.js';
import { FilterProductUseCase } from './application/use-cases/filterProduct.use-case.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Categories,
      Features,
      ProductName,
      AttachmentEntity,
      SubCategories,
      FeatureProductEntity,
      Description,
      Details,
      SubDetails,
      ProductDetail,
    ]),
>>>>>>> 15cbbc06f1931aee169e6a7d908c5a8ef96a9d2b
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
<<<<<<< HEAD
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([ChatEntity]),
    ChatModule,
    SocketModule,
    StoreModule,
    AuthModule,
    FileModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
=======
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'storage/add'),
      // rootPath: join(__dirname, '..', 'storage/add'),
      serveRoot: '/storage/add',
      serveStaticOptions: { index: false },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'storage/img'),
      // rootPath: join(__dirname, '..', 'storage/img'),
      serveRoot: '/storage/img',
      serveStaticOptions: { index: false },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'storage/cov'),
      // rootPath: join(__dirname, '..', 'storage/cov'),
      serveRoot: '/storage/cov',
      serveStaticOptions: { index: false },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'storage/new'),
      // rootPath: join(__dirname, '..', 'storage/new'),
      serveRoot: '/storage/new',
      serveStaticOptions: { index: false },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'storage/pop'),
      // rootPath: join(__dirname, '..', 'storage/pop'),
      serveRoot: '/storage/pop',
      serveStaticOptions: { index: false },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: process.env.DB_TYPE as any,
        host: process.env.DB_HOST,
        port: 5432,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [
          ProductName,
          Features,
          AttachmentEntity,
          Categories,
          SubCategories,
          FeatureProductEntity,
          Description,
          Details,
          SubDetails,
          SubDetailDetails,
          ProductSubDetailDetails,
          ProductDetail,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    CategoryController,
    FeatureController,
    ProductController,
    AttachmentController,
    SubCategoryController,
    AddtionallController,
    DetailController,
    SubDetailsController,
  ],
  providers: [
    AddtionalRepository,
    CategoryRepository,
    FeatureRepository,
    ProductRepository,
    GetProductCategoryRepository,
    AttachmentRepository,
    SubCategoryRepository,
    DetailRepository,
    SubDetailRepository,
    {
      provide: REPOSITORY_TOKENS.SUB_DETAIL,
      useClass: SubDetailRepository,
    },

    {
      provide: REPOSITORY_TOKENS.DETAIL,
      useClass: DetailRepository,
    },
    {
      provide: REPOSITORY_TOKENS.ADDTIONAL,
      useClass: AddtionalRepository,
    },
    {
      provide: REPOSITORY_TOKENS.SUB_CATEGORY_PRODUCT,
      useClass: SubCategoryRepository,
    },
    {
      provide: REPOSITORY_TOKENS.CATEGORY_PRODUCT,
      useClass: GetProductCategoryRepository,
    },
    {
      provide: REPOSITORY_TOKENS.FEATURES,
      useClass: FeatureRepository,
    },

    {
      provide: REPOSITORY_TOKENS.PRODUCT,
      useClass: ProductRepository,
    },
    {
      provide: REPOSITORY_TOKENS.CATEGORY,
      useClass: CategoryRepository,
    },
    {
      provide: REPOSITORY_TOKENS.ATTACHMENT,
      useClass: AttachmentRepository,
    },
    GetAllSubDetailsUseCase,
    CreateDetailSubDetailUseCase,
    CreateDetailUseCase,
    UpdateProductUseCase,
    GetAllSubCategoriesUseCase,
    AddAttachmentUseCase,
    GetSubCategoriesBySubcategoryIdUseCase,
    GetProductCategoryUseCase,
    GetMainCoverUseCase,
    GetProductUseCase,
    CreateFeatureUseCase,
    GetAllProductUseCase,
    GetSubCategoriesUseCase,
    DeleteNewProductUseCase,
    CreateFeatureProductUseCase,
    GetAllFeatureUseCase,
    UpdateDesUseCase,
    GetProductBySearchUseCase,
    GetDesByIdUseCase,
    GetFeaturesFromProductUseCase,
    GetNewProductUseCase,
    GetPopularProductUseCase,
    GetCategoryByIdUseCase,
    CreateProductUseCase,
    DeleteCoverProductUseCase,
    DeleteNormalProductUseCase,
    CreatePopularProductUseCase,
    DeletePopularProductUseCase,
    CreateCoverUseCase,
    GetMoreImagesUseCase,
    GetAllDetailsUseCase,
    CreateSubDetailsUseCase,
    FilterProductUseCase,
>>>>>>> 15cbbc06f1931aee169e6a7d908c5a8ef96a9d2b
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
