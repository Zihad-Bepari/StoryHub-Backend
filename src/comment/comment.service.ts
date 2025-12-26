import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentWithoutPostId, CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';
import { JsonValue } from '@prisma/client/runtime/client';

@Injectable()
export class CommentService {
  constructor(private readonly prisma:PrismaService) {}
  
  async create(postId: string, dto: CommentWithoutPostId) {
    const post = await this.prisma.client.post.findUnique({
      where: { id: postId },
    });
    if (!post) throw new NotFoundException('Post not found');

    const newComment: Record<string, JsonValue> = {
      userId: dto.userId,
      usrname: dto.usrname ?? null,
      content: dto.content,
      createdAt: new Date().toISOString(),
    };

    const updatedComments: Prisma.InputJsonValue[] = post.comments
      ? [...(post.comments as Prisma.InputJsonValue[]), newComment]
      : [newComment];

    await this.prisma.client.post.update({
      where: { id: postId },
      data: { comments: updatedComments },
    });

    return { message: 'Comment added successfully', comment: newComment };
  }

  async update(postId: string, index: number, dto: UpdateCommentDto) {
    const post = await this.prisma.client.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    if (!post.comments || !post.comments[index]) {
      throw new NotFoundException('Comment not found');
    }

    const updatedComments = [...(post.comments as Prisma.InputJsonValue[])];

    const commentToUpdate = updatedComments[index] as Record<string, JsonValue>;
    if (typeof commentToUpdate !== 'object' || commentToUpdate === null) {
      throw new NotFoundException('Invalid comment format');
    }

    updatedComments[index] = {
      ...commentToUpdate,
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    await this.prisma.client.post.update({
      where: { id: postId },
      data: { comments: updatedComments },
    });

    return { message: 'Comment updated successfully', comment: updatedComments[index] };
  }
  async remove(postId: string, index: number) {
    const post = await this.prisma.client.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    if (!post.comments || !post.comments[index]) throw new NotFoundException('Comment not found');

    const deletedComment = post.comments[index];
    const updatedComments = (post.comments as Prisma.InputJsonValue[]).filter((_, i) => i !== index);

    await this.prisma.client.post.update({
      where: { id: postId },
      data: { comments: updatedComments },
    });

    return { message: 'Comment deleted successfully', comment: deletedComment };
  }
}
