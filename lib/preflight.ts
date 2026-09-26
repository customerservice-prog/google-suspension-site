import {type CaseData,evidenceFor,draftFor,issues} from './recovery.ts';
import {draftBasis,reviewCase} from './case-review.ts';
export type PreflightItem={id:string;title:string;detail:string;destination:'overview'|'evidence'|'draft'|'journey';};
export function preflight(c:CaseData){const items:PreflightItem[]=[];const add=(id:string,title:string,detail:string,destination:PreflightItem['destination'])=>items.push({id,title,detail,destination});const review=reviewCase(c);
 if(!c.profileId.trim())add('identity','Record the exact affected ID','Use the profile ID or Ads customer ID from the affected record. A business name alone is not enough.','overview');
 if(!c.notice.trim())add('notice','Keep the actual notice','Paste the notice or decision and its date. The site cannot establish the suspension reason from a selected issue.','journey');
 if(review.route!==c.issue)add('route','Resolve the recommended route change',`Your answers currently point to ${issues[review.route].short.toLowerCase()}. Confirm which route applies before preparing this submission.`,'overview');
 for(const f of review.findings.filter(x=>x.level==='action'))add('finding-'+f.title,f.title,f.detail,'overview');
 const missing=evidenceFor(c).filter(x=>!c.checks.includes('evidence-'+x.id));if(missing.length)add('evidence','Review the evidence checklist',`${missing.length} suggested item${missing.length===1?' is':'s are'} not marked prepared. Check relevance to the actual request; a checkmark is your own review, not verification.`,'evidence');
 const draft=c.draft||draftFor(c);const placeholders=[...new Set(draft.match(/\[[^\]\n]{2,250}\]/g)||[])];if(placeholders.length)add('placeholders','Finish the bracketed draft fields',`${placeholders.length} placeholder${placeholders.length===1?' remains':'s remain'} in the main draft. Replace or remove every placeholder before sending.`,'draft');
 if(c.draft&&c.draftBasis!==draftBasis(c))add('stale','Recheck the draft against your latest facts','Your draft may predate changes to your case. Compare it with the current notice, identity, corrections and evidence.','draft');
 const records=c.records||[];if(records.some(r=>r.reviews.trim()&&!r.observed))add('review-date','Date the review-count observations','A count without a date cannot establish a before-and-after comparison.','journey');
 const ids=records.map(r=>r.profileId.trim()).filter(Boolean);if(new Set(ids).size!==ids.length)add('duplicate-id','Check repeated profile IDs','Two comparison entries contain the same ID. Confirm whether these are different records or repeated observations of one record.','journey');
 if(['duplicate','reviews'].includes(c.issue)&&records.length<2)add('records','Add the affected records','If another listing is involved, record it separately. If there is only one, explain that in your support message.','journey');
 if(Object.values(c.followupDrafts||{}).some(s=>s&&/\[[^\]\n]{2,250}\]/.test(s)))add('followup-placeholders','Review saved follow-up drafts','At least one saved follow-up still has bracketed instructions. Finish the draft you intend to send.','journey');
 return {items,placeholders,prepared:evidenceFor(c).filter(e=>c.checks.includes('evidence-'+e.id)).length,total:evidenceFor(c).length};
}
