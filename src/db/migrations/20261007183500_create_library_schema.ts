import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // 1. borrowers (references pre-existing users table with one-to-one relationship)
  await db.schema
    .createTable('borrowers')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) =>
      col.notNull().unique().references('users.id').onDelete('cascade')
    )
    .addColumn('membership_number', 'varchar(255)', (col) =>
      col.notNull().unique()
    )
    .addColumn('phone', 'varchar(255)')
    .addColumn('address', 'varchar(255)')
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .execute();

  // 2. genres (standalone catalog table)
  await db.schema
    .createTable('genres')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('description', 'text')
    .execute();

  // 3. authors (standalone catalog table)
  await db.schema
    .createTable('authors')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('bio', 'text')
    .addColumn('birth_date', 'date')
    .execute();

  // 4. books (references genres table via one-to-many relationship)
  await db.schema
    .createTable('books')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('isbn', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('publication_year', 'integer')
    .addColumn('genre_id', 'integer', (col) =>
      col.notNull().references('genres.id').onDelete('cascade')
    )
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .execute();

  // 5. book_authors (junction table for authors }o--o{ books many-to-many relationship)
  await db.schema
    .createTable('book_authors')
    .addColumn('book_id', 'integer', (col) =>
      col.notNull().references('books.id').onDelete('cascade')
    )
    .addColumn('author_id', 'integer', (col) =>
      col.notNull().references('authors.id').onDelete('cascade')
    )
    .addPrimaryKeyConstraint('book_authors_pk', ['book_id', 'author_id'])
    .execute();

  // 6. loans (references books and borrowers tables)
  await db.schema
    .createTable('loans')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('book_id', 'integer', (col) =>
      col.notNull().references('books.id').onDelete('cascade')
    )
    .addColumn('borrower_id', 'integer', (col) =>
      col.notNull().references('borrowers.id').onDelete('cascade')
    )
    .addColumn('loan_date', 'timestamp', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .addColumn('due_date', 'timestamp', (col) => col.notNull())
    .addColumn('return_date', 'timestamp')
    .addColumn('status', 'varchar(255)', (col) =>
      col.defaultTo('active').notNull()
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop tables in exact reverse dependency order
  await db.schema.dropTable('loans').execute();
  await db.schema.dropTable('book_authors').execute();
  await db.schema.dropTable('books').execute();
  await db.schema.dropTable('authors').execute();
  await db.schema.dropTable('genres').execute();
  await db.schema.dropTable('borrowers').execute();
}
