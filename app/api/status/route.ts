import {paymentReady,runtime} from '@/lib/server';
import {settings} from '@/lib/settings';
import {getChatGPTUser} from '@/app/chatgpt-auth';
export async function GET(){const u=await getChatGPTUser();const e=runtime();const s=await settings();return Response.json({signedIn:!!u,email:u?.email||null,paymentsEnabled:await paymentReady(),isOperator:!!u&&!!e.OWNER_EMAIL&&u.email.toLowerCase()===e.OWNER_EMAIL.toLowerCase(),supportEmail:s.supportEmail||null,operatorName:s.operatorName||null,refundPolicy:s.refundPolicy||null},{headers:{'Cache-Control':'no-store'}});}
