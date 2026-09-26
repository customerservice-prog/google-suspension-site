import {z} from 'zod';
import {identity,sameOrigin,rateLimit,failure} from '@/lib/server';
import {recordDiagnostic} from '@/lib/diagnostics';
export async function POST(req:Request){try{sameOrigin(req);const u=await identity();await rateLimit(u.userId,'diagnostic',10);const text=await req.text();if(text.length>500)return new Response(null,{status:413});const x=z.object({code:z.enum(['workspace_render','request_failed','document_import']),source:z.enum(['workspace','documents','support','operations'])}).parse(JSON.parse(text));await recordDiagnostic(x.code,x.source);return new Response(null,{status:204});}catch(e){return failure(e);}}
