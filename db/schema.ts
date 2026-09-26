import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const cases=sqliteTable('cases',{id:text('id').primaryKey(),userId:text('user_id').notNull(),data:text('data').notNull(),version:integer('version').notNull().default(1),paid:integer('paid').notNull().default(0),paidUntil:text('paid_until'),created:text('created').notNull(),updated:text('updated').notNull()},t=>[index('cases_user_idx').on(t.userId)]);
export const evidence=sqliteTable('evidence',{id:text('id').primaryKey(),caseId:text('case_id').notNull(),userId:text('user_id').notNull(),name:text('name').notNull(),mime:text('mime').notNull(),size:integer('size').notNull(),created:text('created').notNull()},t=>[index('evidence_case_user_idx').on(t.caseId,t.userId)]);
export const payments=sqliteTable('payments',{id:text('id').primaryKey(),caseId:text('case_id').notNull(),userId:text('user_id').notNull(),status:text('status').notNull(),intent:text('intent'),expires:text('expires'),created:text('created').notNull()});
export const requestLimits=sqliteTable('request_limits',{key:text('key').primaryKey(),count:integer('count').notNull(),expires:integer('expires').notNull()});

