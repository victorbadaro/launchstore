-- STEP 1
DROP DATABASE IF EXISTS launchstoredb;

-- STEP 2
CREATE DATABASE launchstoredb;

-- STEP 3
/* Switch to launchstoredb database */

-- STEP 4
CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "category_id" int NOT NULL,
  "user_id" int,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "old_price" int,
  "price" int NOT NULL,
  "quantity" int DEFAULT 0,
  "status" int DEFAULT 1,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text NOT NULL,
  "product_id" int
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "cpf_cnpj" text UNIQUE NOT NULL,
  "cep" text,
  "address" text,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

-- CONNECT PG SIMPLE TABLE
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "products" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");
ALTER TABLE "products" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "files" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "users" ADD COLUMN reset_token TEXT;
ALTER TABLE "users" ADD COLUMN reset_token_expires TEXT;
ALTER TABLE "products" DROP CONSTRAINT "products_user_id_fkey", ADD CONSTRAINT "products_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;
ALTER TABLE "files" DROP CONSTRAINT "files_product_id_fkey", ADD CONSTRAINT "files_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE CASCADE;

CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- AUTO updated_at products
CREATE TRIGGER trigger_set_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- AUTO updated_at user
CREATE TRIGGER trigger_set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

INSERT INTO categories (name) VALUES ('comida');
INSERT INTO categories (name) VALUES ('eletrônicos');
INSERT INTO categories (name) VALUES ('automóveis');

-- TO RUN SEEDS
DELETE FROM products;
DELETE FROM users;
DELETE FROM files;

-- RESTART SEQUENCE auto_increment FROM TABLES ids
ALTER SEQUENCE products_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE files_id_seq RESTART WITH 1;

-- CREATE ORDERS
CREATE TABLE "orders" (
    "id" SERIAL PRIMARY KEY,
    "seller_id" INT NOT NULL,
    "buyer_id" INT NOT NULL,
    "product_id" INT NOT NULL,
    "price" INT NOT NULL,
    "quantity" INT DEFAULT 0,
    "total" INT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT (now()),
    "updated_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT (now())
);

ALTER TABLE "orders" ADD FOREIGN KEY ("seller_id") REFERENCES "users" ("id");
ALTER TABLE "orders" ADD FOREIGN KEY ("buyer_id") REFERENCES "users" ("id");
ALTER TABLE "orders" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

CREATE TRIGGER trigger_set_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- SOFT DELETE

-- 1. Criar uma coluna na table products chamada "deleted_at"
ALTER TABLE products ADD COLUMN "deleted_at" TIMESTAMP WITHOUT TIME ZONE;

-- 2. Criar uma Regra que vai rodar todas as vezes que solicitarmos o DELETE
CREATE OR REPLACE RULE delete_product AS
ON DELETE TO products DO INSTEAD
UPDATE products SET deleted_at = now() WHERE products.id = old.id;

-- 3. Criar uma VIEW onde vamos puxar somente os dados que estão ativos
CREATE VIEW products_without_deleted AS
SELECT * FROM products WHERE deleted_at IS NULL;

-- 4. Renomear a nossa VIEW e a nossa TABLE
ALTER TABLE products RENAME TO products_with_deleted;
ALTER TABLE products_without_deleted RENAME TO products;