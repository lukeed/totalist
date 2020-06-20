import { Stats } from 'fs';
export type Caller = (relPath: string, absPath: string, stats: Stats) => any;
declare function totalist(dir: string, callback: Caller): void;
export default totalist;
