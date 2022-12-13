import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Inject, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountService } from '../account/account.service';
import { Roles } from '../account/decorators/roles';
import { TRole } from '../account/types/role';
import { PressGetResponseDto } from './dto/press.get.dto';
import { PressPostBodyDto, PressPostResponseDto } from './dto/press.post.dto';
import { PressPutBodyDto, PressPutResponseDto } from './dto/press.put.dto';
import { IPress } from './interfaces/press.interface';
import { PressService } from './press.service';

@ApiTags('СМИ')
@Controller('press')
export class PressController {

    @Inject()
    private readonly accountService: AccountService;
  
    @Inject()
    private readonly pressService: PressService;

    /* READ */
    @Get()
    @ApiOperation({ summary: 'Вывести все новости о застройщике' })
    @ApiQuery({ name: 'accountId', example: 1 })
    @ApiResponse({ status: HttpStatus.OK, type: [PressGetResponseDto] })
    async get(@Query() data: {accountId: number}): Promise<PressGetResponseDto[]> {
        
        if (!data.accountId){
            throw new BadRequestException (`accountId query must not be empty.`)
        }
        
        const account = await this.accountService.findOne(data.accountId);

        if (!account){    
            throw new BadRequestException (`accountId = ${data.accountId} was not found.`)
        }
        if (account.role !== TRole.developer){
            throw new BadRequestException (`accountId = ${data.accountId} isn't developer.`)
        }

        return this.pressService.findByDeveloper(account.developerProperty.id);
    }

    @Get('/:pressId')
    @ApiOperation({ summary: 'Вывести новость' })
    @ApiParam({ name: 'pressId', type: Number })
    @ApiResponse({ status: HttpStatus.OK, type: PressGetResponseDto })
    async getOne(@Param() pressId: IPress['id']): Promise<PressGetResponseDto>{
        return this.pressService.findById(pressId['pressId'])
    }
    /* */

    /* CREATE */
    @Post('/one')
    @ApiBearerAuth()
    @Roles(TRole.admin)
    @ApiOperation({ summary: 'Добавить новость о застройщике' })
    @ApiQuery({ name: 'accountId', example: 1 })
    @ApiResponse({ status: HttpStatus.CREATED, type: PressPostResponseDto })
    async postOne(
        @Body() body: PressPostBodyDto,
        @Query() data: {accountId: number}
    ): Promise<PressPostResponseDto>{


        if (!data.accountId){
            throw new BadRequestException (`accountId query must not be empty.`)
        }

        const account = await this.accountService.findOne(data.accountId);

        if (account.role !== TRole.developer){
            throw new BadRequestException (`accountId = ${data.accountId} isn't developer.`)
        }

        return this.pressService.createOne(body, account.developerProperty.id)
    }

    @Post('/some')
    @ApiBearerAuth()
    @Roles(TRole.admin)
    @ApiOperation({ summary: 'Добавить новости о застройщике' })
    @ApiQuery({ name: 'accountId', example: 1 })
    @ApiBody({ type: [PressPostBodyDto] })
    @ApiResponse({ status: HttpStatus.CREATED, type: [PressPostResponseDto] })
    async postSome(
        @Body() body: [PressPostBodyDto],
        @Query() data: {accountId: number}
    ): Promise<PressPostResponseDto[]>{
        
        if (!data.accountId){
            throw new BadRequestException (`accountId query must not be empty.`)
        }

        const account = await this.accountService.findOne(data.accountId);

        if (account.role !== TRole.developer){
            throw new BadRequestException (`accountId = ${data.accountId} isn't developer.`)
        }
        
        return this.pressService.createSome(body, account.developerProperty.id)
    }   
    /* */

    /* UPDATE */
    @Put('/:pressId')
    @ApiBearerAuth()
    @Roles(TRole.admin)
    @ApiOperation({ summary: 'Изменить новость' })
    @ApiParam({ name: 'pressId', type: Number })
    @ApiBody({ type: PressPutBodyDto })
    @ApiResponse({ status: HttpStatus.OK, type: PressPutResponseDto })
    async put(
      @Param() pressId: IPress['id'],
      @Body() data: PressPutBodyDto
    ): Promise<PressPutResponseDto> {
        const press = await this.pressService.findById(pressId['pressId'])
        
        if (!press) {
            throw new NotFoundException(`pressId = ${pressId['pressId']} was not found`);
        }
        return this.pressService.update(press, data)
    }
    /* */

    /* DELETE */
    @Delete('/:pressId')
    @ApiBearerAuth()
    @Roles(TRole.admin)
    @ApiOperation({ summary: 'Удалить новость' })
    @ApiParam({ name: 'pressId', type: Number })
    @ApiResponse({ status: HttpStatus.OK })
    async delete(@Param() pressId: IPress['id']): Promise<{ status: 'success' }> {
        await this.pressService.delete(pressId['pressId']);
        return { status: 'success' };
    }
    /* */
}
