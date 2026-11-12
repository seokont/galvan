import { createHash } from 'node:crypto';
import { isIP } from 'node:net';
// Best-effort per-instance protection. Persistent per-email limits also run in PostgreSQL.
const clients=new Map<string,{count:number;until:number}>();
export function takeEnquiryQuota(ip:string,now=Date.now()){
  if(!isIP(ip))return true;
  const key=createHash('sha256').update(ip).digest('hex');
  let entry=clients.get(key);
  if(!entry||entry.until<=now){
    if(clients.size>=2048){for(const [key,value] of clients)if(value.until<=now)clients.delete(key);}
    if(clients.size>=2048)clients.delete(clients.keys().next().value!);
    entry={count:0,until:now+10*60*1000};clients.set(key,entry);
  }
  entry.count++;return entry.count<=8;
}
