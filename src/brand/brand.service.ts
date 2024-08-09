import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Brand } from "../entities/index";
import { AddBrandDto } from "./../dto";
import { UserService } from "./../user/user.service";

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    private readonly userService: UserService
  ) {}
  async addBrand(id, addBrandDto: AddBrandDto): Promise<any> {
    const brand = new Brand();
    brand.name = addBrandDto.name;
    brand.email = addBrandDto.email;
    brand.editor = await this.userService._findUser("id", id);
    const savedBrand = await this.brandRepository.save(brand);
  }

  async findBrand(brandId): Promise<any> {
    return await this.brandRepository.findOne({ where: { id: brandId } });
  }
  async findAllBrand(): Promise<any> {
    return await this.brandRepository.find();
  }
  async findLoginEdiotrbrand(id): Promise<any> {
    return await this.brandRepository.find({ where: { editor: { id: id } } });
  }
}
