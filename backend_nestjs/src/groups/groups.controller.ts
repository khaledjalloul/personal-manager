import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUserId } from 'src/auth/get-user-id.decorator';

@UseGuards(AuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  findAll(
    @Query('maxUsers') maxUsers?: string,
    @Query('searchText') searchText?: string,
  ) {
    const maxUsersInt = maxUsers ? parseInt(maxUsers) : undefined;
    return this.groupsService.findAll(maxUsersInt, searchText);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.findOne(id);
  }

  @Post()
  create(@GetUserId() userId: number, @Body() dto: CreateGroupDto) {
    return this.groupsService.create(userId, dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGroupDto) {
    return this.groupsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.remove(id);
  }
}
