ALTER TABLE "main"."announcement" RENAME COLUMN "auther" TO "creator";--> statement-breakpoint
ALTER TABLE "main"."messages" RENAME COLUMN "sender_email" TO "sender";--> statement-breakpoint
ALTER TABLE "main"."messages" RENAME COLUMN "receiver_email" TO "receiver";--> statement-breakpoint
ALTER TABLE "main"."announcement" DROP CONSTRAINT "announcement_auther_course_professor_fk";
--> statement-breakpoint
ALTER TABLE "main"."assignment_data" ADD COLUMN "creator" text NOT NULL;--> statement-breakpoint
ALTER TABLE "main"."messages" ADD COLUMN "details" jsonb;--> statement-breakpoint
ALTER TABLE "main"."announcement" ADD CONSTRAINT "announcement_creator_course_professor_fk" FOREIGN KEY ("creator") REFERENCES "main"."course"("professor") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."assignment_data" ADD CONSTRAINT "assignment_data_creator_course_professor_fk" FOREIGN KEY ("creator") REFERENCES "main"."course"("professor") ON DELETE cascade ON UPDATE no action;