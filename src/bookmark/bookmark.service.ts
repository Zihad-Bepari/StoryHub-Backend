import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class BookmarkService {

  constructor(private readonly prisma:PrismaService) {}

  async create(createBookmarkDto: CreateBookmarkDto) {
    const bookmark = await this.prisma.client.bookmark.create({
      data: {
        targetId: createBookmarkDto.postId,
        targetType: 'POST',
      },
    });
    return { message: 'Bookmark created', data: bookmark };
  } 
  async findAll() {
    return this.prisma.client.bookmark.findMany();
  } 
  async findOne(id: string) {
    return this.prisma.client.bookmark.findUnique({
      where: { id },
    });
  } 
  async remove(id: string) {
    return this.prisma.client.bookmark.delete({
      where: { id },
    });
  }
}
