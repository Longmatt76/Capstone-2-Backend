\echo 'Delete and recreate your_store db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE your_store;
CREATE DATABASE your_store;
\connect your_store

\i your_store-schema.sql


\echo 'Delete and recreate your_store_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE your_store_test;
CREATE DATABASE your_store_test;
\connect your_store_test

\i your_store-schema.sql