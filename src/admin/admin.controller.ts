import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: PrismaService) {}

 @Patch('block/:id')
blockUser(@Param('id') id: string) {
  return this.adminService.client.users.update({
    where: { id: Number(id) },
    data: { isblocked: true },
  });
}

@Patch('unblock/:id')
unblockUser(@Param('id') id: string) {
  return this.adminService.client.users.update({
    where: { id: Number(id) },
    data: { isblocked: false },
  });
}



  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.client.createPost.delete({
      where: { id: Number(id) },
    });
  }

}
