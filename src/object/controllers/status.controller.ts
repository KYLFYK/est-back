import { Controller, Get, HttpStatus, Inject, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatusGetResponseDto } from '../dto/status/status.get.dto';
import { StatusService } from '../services/status.service';

@ApiTags('Статусы')
@Controller('status')
export class StatusController {
    
    @Inject()
    private readonly statusService: StatusService;

    @Get()
    @ApiOperation({ summary: 'Вывести все статусы' })
    @ApiResponse({ status: HttpStatus.OK, type: [StatusGetResponseDto] })
    async get(): Promise<StatusGetResponseDto[]> {
        return this.statusService.findAll();
    }

}
