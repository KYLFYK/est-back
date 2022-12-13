import { IBaseIdInterface } from 'src/common/interfaces/base.interface';
import { IFile } from 'src/file/interfaces/IFile';

export interface IConstructionProgress extends IBaseIdInterface {
    date: Date;
    description: string;
    file: IFile[];
}