ALTER TABLE "registered" DROP CONSTRAINT "registered_period_week_unique";--> statement-breakpoint
ALTER TABLE "registered" DROP COLUMN "period";--> statement-breakpoint
ALTER TABLE "registered" DROP COLUMN "week";--> statement-breakpoint
ALTER TABLE "registered" ADD CONSTRAINT "registered_name_email_unique" UNIQUE("name","email");