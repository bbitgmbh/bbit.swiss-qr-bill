import { promises as fs } from 'fs';

import path from 'path';
import { name, version, license } from '../package.json';

(async (): Promise<void> => {
  const sourceDir = path.resolve('./dist/types');
  const targetDir = path.resolve('./dist/interfaces');

  const pkg = {
    name: name + '-interfaces',
    version,
    license,
    types: 'index.d.ts',
    files: ['**/*'],
  };

  // create package.json
  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(path.resolve(targetDir, 'package.json'), JSON.stringify(pkg, null, 2));
  await fs.copyFile(path.resolve(sourceDir, 'interfaces.d.ts'), path.resolve(targetDir, 'index.d.ts'));
  await fs.copyFile(path.resolve('./LICENSE.md'), path.resolve(targetDir, 'LICENSE.md'));
})()
  .then((): void => {
    console.log('Successfully created interface package');
    process.exit(0);
  })
  .catch((err): void => {
    console.error('Error while creating interfaces package');
    console.error(err);
    process.exit(1);
  });
