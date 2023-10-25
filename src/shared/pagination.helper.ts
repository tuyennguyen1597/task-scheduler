import { Injectable } from '@nestjs/common';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { PageOptionsDTO } from '../common/dto/page-option.dto';
import { PageDTO } from '../common/dto/page.dto';

@Injectable()
export class PaginationService {
    constructor() {}
    
    async withPage<T>(ships: T[], pageOption?: PageOptionsDTO) {
        if (!pageOption) pageOption = {page: 1, take: ships.length, skip: 0}
        
        const pageMeta: PageMetaDto = new PageMetaDto({
            pageOptionsDto: pageOption,
            itemCount: ships.length,
        });

        return new PageDTO(
            ships.slice(
                (pageOption.page - 1) * pageOption.take,
                pageOption.page * pageOption.take
            ),
            pageMeta
        );
    }
}