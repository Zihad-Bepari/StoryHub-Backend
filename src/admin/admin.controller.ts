import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { PrismaService } from '@/common/prisma/prisma.service';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(
         private readonly prisma: PrismaService,
         private readonly adminService: AdminService,
  ) {}
 
 @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

 @Patch('block/:id')
blockUser(@Param('id') id: string) {
  return this.prisma.client.users.update({
    where: { id: id },
    data: { isblocked: true },
  });
}

@Patch('unblock/:id')
unblockUser(@Param('id') id: string) {
  return this.prisma.client.users.update({
    where: { id: id },
    data: { isblocked: false },
  });
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prisma.client.post.delete({
      where: { id: id },
    });
  }

}
