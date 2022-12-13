import { IBaseIdInterface } from '../../common/interfaces/base.interface';
import { TType_en, TType_ru } from '../types/type';
import { TFor } from '../types/for';
import { TSubtitle_en, TSubtitle_ru } from '../types/subtitle';

export interface IGuide extends IBaseIdInterface {
  subtitle_en: string;
  subtitle_ru: string;
  type_en: TType_en;
  type_ru: TType_ru;
  for: Array<TFor>;
  isMulti?: boolean;
  value: string;
}
