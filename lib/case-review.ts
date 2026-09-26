import type {CaseData,Issue} from './recovery.ts';
export type Answer='yes'|'no'|'unknown';
export type Triage={accountRestricted?:Answer;managementAccess?:Answer;publicVisible?:Answer;addressVisible?:Answer;permanentSignage?:Answer;documentName?:string;documentAddress?:string};
export type Finding={title:string;detail:string;source:number;level:'action'|'check'};
const normalized=(s:string)=>s.toLocaleLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
export function reviewCase(c:CaseData){
 const t=c.triage||{};let route:Issue=c.issue;let reason='This route follows the issue you selected.';const findings:Finding[]=[];
 const add=(title:string,detail:string,source=0,level:'action'|'check'='check')=>findings.push({title,detail,source,level});
 if(c.issue==='ads')return {route,reason:'Google Ads has its own appeal process. Business Profile answers do not change this route.',findings,next:'Review the exact Ads policy notice and use the Google Ads suspension appeal process.'};
 if(t.accountRestricted==='yes'){route='restricted';reason='You confirmed an account restriction. Resolve that restriction before appealing individual profiles.';}
 else if(c.status==='Denied'){route='denied';reason='You recorded a denied appeal. Review the decision and prepare new supporting evidence for additional review.';}
 else if(c.status==='Approved'&&t.managementAccess==='no'){route='ownership';reason='You recorded approval but confirmed that you cannot manage the profile. Check ownership and the signed-in account next.';}
 if(!t.accountRestricted||t.accountRestricted==='unknown')add('Check account-level restrictions','Read the account notice while signed in to the managing account. A restricted account changes which appeal comes first.');
 if(c.type==='online')add('Resolve business eligibility first','Online-only businesses generally do not qualify. Check the in-person contact requirements before preparing a reinstatement appeal.',1,'action');
 if(c.type==='service'&&t.addressVisible==='yes')add('Review your public address','If customers are not served at this address, hide it from the public profile and use a service area. Record any genuine correction.',1,'action');
 if(['storefront','hybrid'].includes(c.type)&&t.permanentSignage==='no')add('Check storefront requirements','A business showing its address should have permanent fixed signage. Check your actual location and eligibility; do not invent evidence.',1,'action');
 if(t.documentName&&c.business&&normalized(t.documentName)!==normalized(c.business))add('Explain the name difference','Your entered document name differs from your profile name. Check the original document and explain any legitimate legal-name or trading-name relationship.',0,'action');
 if(t.documentAddress&&c.address&&normalized(t.documentAddress)!==normalized(c.address))add('Explain the address difference','Your entered document address differs from your operating address. Check formatting, document dates and any move history before submission.',0,'action');
 if(c.status==='Approved'&&t.publicVisible==='no')add('Approval recorded, visibility still missing','Compare the approval with the original profile ID and check the profile while signed out. Keep screenshots and follow the existing support thread if the approved profile remains unavailable.');
 if(c.previousAddress)add('Preserve your move history','Keep the original profile ID, former and current addresses, dates and supporting records together. A move does not automatically justify creating another profile.',6);
 if(!c.notice.trim())add('Keep the exact notice','Paste the policy wording from Google. The selected issue alone does not establish why Google took action.');
 if(!c.profileId.trim())add('Record the affected profile ID','Use the exact record in your appeal and evidence, especially when there are similarly named or duplicate listings.');
 let next='Complete the checks below, gather authentic evidence and review the official route before submission.';
 if(c.status==='Submitted')next='Track the existing appeal in Google’s appeals tool. Keep the case reference and response in your timeline; do not create another profile while the appeal is under review.';
 if(c.status==='More evidence requested')next='Read the actual request and deadline. Gather only the requested, relevant evidence, then respond through the channel Google supplied.';
 if(c.status==='Denied')next='Read the denial and compare it with your original evidence. Address the unresolved issue before requesting additional review where available.';
 if(c.status==='Approved')next='Check both public visibility and management access using the original profile and managing account. Record what is restored and what remains missing.';
 if(c.status==='Access restored')next='Confirm the original profile, management permissions and business details. Save the decision and keep your evidence for future changes.';
 return {route,reason,findings,next};
}
export function draftBasis(c:CaseData){return JSON.stringify([c.issue,c.business,c.email,c.profileId,c.mapsUrl,c.address,c.previousAddress,c.notice,c.corrections,c.caseNumber,c.checks.filter(x=>x.startsWith('evidence-')).sort()]);}
export function reviewText(c:CaseData){const r=reviewCase(c);return `CASE REVIEW — based on your answers, not document verification\n${r.reason}\nNext action: ${r.next}\n${r.findings.map(f=>`[${f.level==='action'?'Review before submitting':'Check'}] ${f.title}: ${f.detail}`).join('\n')}`;}
