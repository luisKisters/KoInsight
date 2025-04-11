import { promises, rmSync } from 'fs';
import { COVERS_PATH } from '../const';

export async function deleteExistingCover(bookMd5: string) {
  const files = await promises.readdir(COVERS_PATH);
  const file = files.find((f) => f.startsWith(bookMd5));

  if (file) {
    const filePath = `${COVERS_PATH}/${file}`;
    rmSync(filePath, { force: true });
  }
}
