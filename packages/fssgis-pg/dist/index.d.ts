import { PoolConfig, QueryResult } from 'pg';

declare function setDefaultPool(config: PoolConfig): void;
declare function pgSqlExec<T>(sqlStr: string, poolConfig?: PoolConfig): Promise<QueryResult<T>>;

export { pgSqlExec, setDefaultPool };
