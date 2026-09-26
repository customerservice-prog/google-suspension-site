import {paymentReady} from '@/lib/server';
import {getChatGPTUser} from '@/app/chatgpt-auth';
export async function GET(){const u=await getChatGPTUser();return Response.json({signedIn:!!u,email:u?.email||null,paymentsEnabled:paymentReady()},{headers:{'Cache-Control':'no-store'}});}
