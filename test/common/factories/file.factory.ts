import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { FileEntity } from 'src/file/entities/file.entity';
import { IFile } from 'src/file/interfaces/IFile';

define(FileEntity, (faker: typeof Faker) => {

  const entity = new FileEntity();

  const fileName = `${faker.random.alphaNumeric(11)}.jpg`
  const data: Omit<IFile, 'id' | 'createAt' | 'updateAt' > = {
    fileName: fileName,
    url: `https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Ym9va3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=&q=75`,
    mimeType: 'image/jpeg',
    size: '40960'
  };

  return Object.assign(entity, data);
});
