import {paymentReady,runtime} from '@/lib/server';
import {getChatGPTUser} from '@/app/chatgpt-auth';
export async function GET(){const u=await getChatGPTUser();const e=runtime();return Response.json({signedIn:!!u,email:u?.email||null,paymentsEnabled:paymentReady(),isOperator:!!u&&!!e.OWNER_EMAIL&&u.email.toLowerCase()===e.OWNER_EMAIL.toLowerCase(),supportEmail:e.SUPPORT_EMAIL||null,operatorName:e.OPERATOR_NAME||null,refundPolicy:e.REFUND_POLICY||null},{headers:{'Cache-Control':'no-store'}});}
