import fs from 'fs';
import path from 'path';

import { MigrationInterface, QueryRunner } from 'typeorm';

const sql = fs.readFileSync(
    path.join(__dirname, '../../deploy/sql/bitepoint.sql'),
    'utf8'
);

export class InitDatabase1745172743189 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(sql);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
