import { Stats } from 'fs';

type Caller = (relPath: string, absPath: string, stats: Stats) => any;
declare function totalist(dir: string, callback: Caller): Promise<void>;
export default totalist;
