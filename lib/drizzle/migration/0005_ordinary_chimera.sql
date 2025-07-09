ALTER TABLE "registered" DROP CONSTRAINT "registered_week_course_week_fk";
--> statement-breakpoint
ALTER TABLE "registered" DROP CONSTRAINT "registered_period_course_period_fk";
--> statement-breakpoint
ALTER TABLE "registered" DROP CONSTRAINT "registered_email_name_pk";--> statement-breakpoint
ALTER TABLE "registered" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "registered" DROP COLUMN "week";--> statement-breakpoint
ALTER TABLE "registered" DROP COLUMN "period";