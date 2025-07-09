ALTER TABLE "registered" ADD CONSTRAINT "registered_email_name_pk" PRIMARY KEY("email","name");--> statement-breakpoint
ALTER TABLE "registered" ADD COLUMN "week" "week";--> statement-breakpoint
ALTER TABLE "registered" ADD COLUMN "period" "period";--> statement-breakpoint
ALTER TABLE "registered" ADD CONSTRAINT "registered_week_course_week_fk" FOREIGN KEY ("week") REFERENCES "public"."course"("week") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registered" ADD CONSTRAINT "registered_period_course_period_fk" FOREIGN KEY ("period") REFERENCES "public"."course"("period") ON DELETE cascade ON UPDATE no action;