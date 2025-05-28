ALTER TABLE "settings" RENAME COLUMN "user_id" TO "email";--> statement-breakpoint
ALTER TABLE "settings" DROP CONSTRAINT "settings_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "settings" ADD CONSTRAINT "settings_email_users_email_fk" FOREIGN KEY ("email") REFERENCES "public"."users"("email") ON DELETE cascade ON UPDATE no action;