import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Product, ProductType, LicenseType } from './entities/product.entity';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async createProduct(createProductDto: CreateProductDto, file, userId: string) {
    if (!file) {
      throw new BadRequestException('产品文件是必须的');
    }

    const product = this.productRepository.create({
      ...createProductDto,
      filePath: file.path,
      sellerId: userId,
    });

    return this.productRepository.save(product);
  }

  async uploadPreview(id: string, file, userId: string) {
    const product = await this.findOneProduct(id);

    if (product.sellerId !== userId) {
      throw new UnauthorizedException('您无权修改此产品');
    }

    if (!file) {
      throw new BadRequestException('预览文件是必须的');
    }

    // 如果已有预览，删除旧文件
    if (product.previewFilePath && fs.existsSync(product.previewFilePath)) {
      fs.unlinkSync(product.previewFilePath);
    }

    product.previewFilePath = file.path;
    return this.productRepository.save(product);
  }

  async uploadCover(id: string, file, userId: string) {
    const product = await this.findOneProduct(id);

    if (product.sellerId !== userId) {
      throw new UnauthorizedException('您无权修改此产品');
    }

    if (!file) {
      throw new BadRequestException('封面图片是必须的');
    }

    // 如果已有封面，删除旧文件
    if (product.coverImagePath && fs.existsSync(product.coverImagePath)) {
      fs.unlinkSync(product.coverImagePath);
    }

    product.coverImagePath = file.path;
    return this.productRepository.save(product);
  }

  async findAllProducts(
    page: number = 1, 
    limit: number = 10,
    type?: ProductType,
    license?: LicenseType,
    search?: string
  ) {
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    
    // 基本连接
    queryBuilder.innerJoinAndSelect('product.seller', 'seller');
    
    // 条件过滤
    if (type) {
      queryBuilder.andWhere('product.productType = :type', { type });
    }
    
    if (license) {
      queryBuilder.andWhere('product.licenseType = :license', { license });
    }
    
    if (search) {
      queryBuilder.andWhere(
        '(product.title LIKE :search OR product.description LIKE :search)',
        { search: `%${search}%` }
      );
    }
    
    // 分页
    queryBuilder.skip((page - 1) * limit).take(limit);
    
    // 排序
    queryBuilder.orderBy('product.createdAt', 'DESC');
    
    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findProductsBySeller(userId: string, page: number = 1, limit: number = 10) {
    const [items, total] = await this.productRepository.findAndCount({
      where: { sellerId: userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneProduct(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`ID为${id}的产品不存在`);
    }
    return product;
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto, userId: string) {
    const product = await this.findOneProduct(id);

    if (product.sellerId !== userId) {
      throw new UnauthorizedException('您无权修改此产品');
    }

    await this.productRepository.update(id, updateProductDto);
    return this.findOneProduct(id);
  }

  async removeProduct(id: string, userId: string) {
    const product = await this.findOneProduct(id);

    if (product.sellerId !== userId) {
      throw new UnauthorizedException('您无权删除此产品');
    }

    // 删除相关文件
    if (product.filePath && fs.existsSync(product.filePath)) {
      fs.unlinkSync(product.filePath);
    }
    
    if (product.previewFilePath && fs.existsSync(product.previewFilePath)) {
      fs.unlinkSync(product.previewFilePath);
    }
    
    if (product.coverImagePath && fs.existsSync(product.coverImagePath)) {
      fs.unlinkSync(product.coverImagePath);
    }

    return this.productRepository.remove(product);
  }

  async createOrder(productId: string, userId: string) {
    const product = await this.findOneProduct(productId);
    
    // 检查用户是否购买自己的产品
    if (product.sellerId === userId) {
      throw new BadRequestException('您不能购买自己的产品');
    }

    // 生成唯一订单号
    const orderNumber = `ORDER-${Date.now()}-${uuidv4().substring(0, 8)}`;
    
    const order = this.orderRepository.create({
      orderNumber,
      buyerId: userId,
      productId: productId,
      amount: product.price,
      status: OrderStatus.PENDING,
    });

    return this.orderRepository.save(order);
  }

  async findOrdersByBuyer(userId: string, page: number = 1, limit: number = 10) {
    const [items, total] = await this.orderRepository.findAndCount({
      where: { buyerId: userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneOrder(id: string, userId: string) {
    const order = await this.orderRepository.findOne({ 
      where: { id },
      relations: ['product'] 
    });
    
    if (!order) {
      throw new NotFoundException(`ID为${id}的订单不存在`);
    }
    
    // 检查是否是该用户的订单
    if (order.buyerId !== userId && order.product.sellerId !== userId) {
      throw new UnauthorizedException('您无权查看此订单');
    }
    
    return order;
  }

  async processPayment(orderId: string, userId: string) {
    const order = await this.findOneOrder(orderId, userId);
    
    if (order.buyerId !== userId) {
      throw new UnauthorizedException('您无权支付此订单');
    }
    
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('此订单状态不允许支付');
    }
    
    // 简化处理，实际应集成支付系统
    order.status = OrderStatus.PAID;
    order.paymentMethod = 'simulated';
    order.paymentId = `PAY-${Date.now()}`;
    
    // 更新产品销售量
    const product = await this.findOneProduct(order.productId);
    product.sales += 1;
    await this.productRepository.save(product);
    
    return this.orderRepository.save(order);
  }

  async generateDownloadLink(orderId: string, userId: string) {
    const order = await this.findOneOrder(orderId, userId);
    
    if (order.buyerId !== userId) {
      throw new UnauthorizedException('您无权下载此产品');
    }
    
    if (order.status !== OrderStatus.PAID && order.status !== OrderStatus.COMPLETED) {
      throw new BadRequestException('此订单未完成支付，无法下载');
    }
    
    // 实际应生成带签名的临时下载链接
    const downloadToken = uuidv4();
    order.downloadLink = `/api/download/${downloadToken}`;
    order.isDownloaded = true;
    
    if (order.status === OrderStatus.PAID) {
      order.status = OrderStatus.COMPLETED;
    }
    
    await this.orderRepository.save(order);
    
    return { downloadLink: order.downloadLink };
  }

  async getSalesStats(userId: string) {
    // 获取用户的所有产品销售额
    const products = await this.productRepository.find({
      where: { sellerId: userId }
    });
    
    const productIds = products.map(p => p.id);
    
    const completedOrders = await this.orderRepository.find({
      where: {
        productId: In(productIds),
        status: In([OrderStatus.PAID, OrderStatus.COMPLETED])
      }
    });
    
    const totalSales = products.reduce((sum, product) => sum + product.sales, 0);
    const totalRevenue = completedOrders.reduce((sum, order) => sum + Number(order.amount), 0);
    
    // 按产品类型统计
    const salesByType = {};
    products.forEach(product => {
      if (!salesByType[product.productType]) {
        salesByType[product.productType] = {
          sales: 0,
          revenue: 0
        };
      }
      salesByType[product.productType].sales += product.sales;
    });
    
    completedOrders.forEach(order => {
      const product = products.find(p => p.id === order.productId);
      if (product) {
        salesByType[product.productType].revenue += Number(order.amount);
      }
    });
    
    return {
      totalSales,
      totalRevenue,
      salesByType
    };
  }
} 