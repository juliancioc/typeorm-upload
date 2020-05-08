import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddSpreadsheet1588725431263 implements MigrationInterface {
    
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn(
            'transactions',
            new TableColumn({
                name: 'spreadsheet',
                type: 'varchar',
                isNullable: true
            }),
        )
    }
    
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('spreadsheets', 'file')
    }
    
}
