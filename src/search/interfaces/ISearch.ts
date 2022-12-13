export interface ISearch {
  'order-type': string,
  'object-type': string,
  'rooms': string[],
  'price-from'?: number,
  'price-to'?: number,
  'square-from'?: number,
  'square-to'?: number,
  'building-type': string,
  'floor'?: number,
  'benefit'?: string[],
  'building'?: boolean,
  city?: number,
}
