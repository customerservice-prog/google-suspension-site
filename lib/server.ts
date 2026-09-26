import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '@/app/chatgpt-auth';
export function runtime(){return env as unknown as {DB:D1Database;BUCKET:R2Bucket;STRIPE_SECRET_KEY?:string;STRIPE_WEBHOOK_SECRET?:string;STRIPE_PRICE_ID?:string;SITE_URL?:string;PAYMENTS_ENABLED?:string};}
export function db(){const d=runtime().DB;if(!d)throw new Error('Case storage is unavailable. Please try again later.');return d;}
export async function identity(){const u=await getChatGPTUser();if(!u)throw new Error('SIGN_IN_REQUIRED');return u;}
export function sameOrigin(req:Request){const origin=req.headers.get('origin');if(!origin||origin!==new URL(req.url).origin)throw new Error('Request origin is not allowed.');}
export async function owned(id:string,userId:string){return db().prepare('SELECT * FROM cases WHERE id=? AND user_id=?').bind(id,userId).first<{id:string;user_id:string;data:string;version:number;paid:number}>();}
export function failure(e:unknown){const m=e instanceof Error?e.message:'Unable to complete this request.';return Response.json({error:m==='SIGN_IN_REQUIRED'?'Sign in to save your case.':m},{status:m==='SIGN_IN_REQUIRED'?401:400});}
export function paymentReady(){const e=runtime();return !!(e.PAYMENTS_ENABLED==='true'&&e.STRIPE_SECRET_KEY&&e.STRIPE_WEBHOOK_SECRET&&e.STRIPE_PRICE_ID&&e.SITE_URL);}
