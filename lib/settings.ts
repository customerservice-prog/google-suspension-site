import {z} from 'zod';
import {db,runtime} from './server';
export const settingsSchema=z.object({operatorName:z.string().trim().max(160),supportEmail:z.union([z.string().email().max(254),z.literal('')]),refundPolicy:z.string().trim().max(6000),publicUrl:z.union([z.string().url().refine(s=>new URL(s).protocol==='https:','Use HTTPS.'),z.literal('')]),termsReviewed:z.boolean(),browserReviewed:z.boolean()});
export type LaunchSettings=z.infer<typeof settingsSchema>;
export async function settings():Promise<LaunchSettings>{const e=runtime();const row=await db().prepare("SELECT value FROM site_settings WHERE key='launch'").first<{value:string}>();const base={operatorName:e.OPERATOR_NAME||'',supportEmail:e.SUPPORT_EMAIL||'',refundPolicy:e.REFUND_POLICY||'',publicUrl:e.SITE_URL||'',termsReviewed:e.LAUNCH_REVIEWED==='true',browserReviewed:false};return row?settingsSchema.parse({...base,...JSON.parse(row.value)}):base;}
export async function audit(action:string,actor:string,detail:string){await db().prepare('INSERT INTO operation_events (id,action,actor,detail,created) VALUES (?,?,?,?,?)').bind(crypto.randomUUID(),action,actor,detail,new Date().toISOString()).run();}
