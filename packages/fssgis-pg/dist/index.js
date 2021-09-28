'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pg = require('pg');

let _poolConfig;

function setDefaultPool(config) {
  _poolConfig = config;
}
async function pgSqlExec(sqlStr, poolConfig = _poolConfig) {
  const pool = new pg.Pool(poolConfig);
  const client = await pool.connect();
  const result = await client.query(sqlStr);
  client.release();
  pool.end();
  return result;
}

exports.pgSqlExec = pgSqlExec;
exports.setDefaultPool = setDefaultPool;
