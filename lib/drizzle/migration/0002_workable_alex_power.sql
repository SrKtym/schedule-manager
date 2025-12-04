ALTER TABLE "main"."announcement" RENAME COLUMN "creator" TO "user_id";--> statement-breakpoint
ALTER TABLE "main"."assignment_data" RENAME COLUMN "creator" TO "user_id";--> statement-breakpoint
ALTER TABLE "main"."announcement" DROP CONSTRAINT "announcement_creator_course_professor_fk";
--> statement-breakpoint
ALTER TABLE "main"."assignment_data" DROP CONSTRAINT "assignment_data_creator_course_professor_fk";
--> statement-breakpoint
ALTER TABLE "main"."announcement" ADD CONSTRAINT "announcement_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "better_auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."assignment_data" ADD CONSTRAINT "assignment_data_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "better_auth"."users"("id") ON DELETE cascade ON UPDATE no action;