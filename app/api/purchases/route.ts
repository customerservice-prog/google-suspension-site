import {identity,db,failure} from '@/lib/server';
export async function GET(){try{const u=await identity();const rows=await db().prepare('SELECT id,case_id,status,created,expires FROM payments WHERE user_id=? ORDER BY created DESC').bind(u.userId).all();return Response.json({purchases:rows.results},{headers:{'Cache-Control':'private, no-store'}});}catch(e){return failure(e);}}
