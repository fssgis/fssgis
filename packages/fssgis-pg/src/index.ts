import { QueryResult, Pool, PoolConfig } from 'pg'

let _poolConfig: PoolConfig

export function setDefaultPool (config: PoolConfig) : void {
  _poolConfig = config
}

export async function pgSqlExec <T> (sqlStr: string, poolConfig: PoolConfig = _poolConfig) : Promise<QueryResult<T>> {
  const pool = new Pool(poolConfig)
  const client = await pool.connect()
  const result = await client.query(sqlStr)
  client.release()
  pool.end()
  return result
}

