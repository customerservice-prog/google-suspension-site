export const PASS_PRICE=7900;
export const PASS_DAYS=90;
export const TERMS_VERSION='2026-09-26-preview';
export function activePass(c:{paid:number|boolean;paid_until?:string|null},now=Date.now()){return !!c.paid&&!!c.paid_until&&Date.parse(c.paid_until)>now;}
export function passExpiry(created:number){return new Date((created+PASS_DAYS*86400)*1000).toISOString();}
export function eligibleSession(s:any){return s?.mode==='payment'&&s.payment_status==='paid'&&s.amount_total===PASS_PRICE&&s.currency==='usd'&&typeof s.metadata?.case_id==='string'&&typeof s.metadata?.user_id==='string'&&s.metadata?.terms_version===TERMS_VERSION&&typeof s.id==='string'&&typeof s.created==='number';}
