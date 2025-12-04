CREATE TABLE "main"."announcement_attachment_metadata_ids" (
	"announcement_id" text NOT NULL,
	"attachment_metadata_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "announcement_attachment_metadata_ids_announcement_id_attachment_metadata_id_pk" PRIMARY KEY("announcement_id","attachment_metadata_id")
);
--> statement-breakpoint
CREATE TABLE "main"."assignment_attachment_metadata_ids" (
	"assignment_id" text NOT NULL,
	"attachment_metadata_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "assignment_attachment_metadata_ids_assignment_id_attachment_metadata_id_pk" PRIMARY KEY("assignment_id","attachment_metadata_id")
);
--> statement-breakpoint
CREATE TABLE "main"."submission_metadata_ids" (
	"submission_id" text NOT NULL,
	"submission_metadata_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "submission_metadata_ids_submission_id_submission_metadata_id_pk" PRIMARY KEY("submission_id","submission_metadata_id")
);
--> statement-breakpoint
ALTER TABLE "main"."attribute" RENAME TO "student_attribute";--> statement-breakpoint
ALTER TABLE "main"."announcement" DROP CONSTRAINT "announcement_attachments_metadata_ids_attachment_metadata_id_fk";
--> statement-breakpoint
ALTER TABLE "main"."assignment_data" DROP CONSTRAINT "assignment_data_attachments_metadata_ids_attachment_metadata_id_fk";
--> statement-breakpoint
ALTER TABLE "main"."student_attribute" DROP CONSTRAINT "attribute_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "main"."submission" DROP CONSTRAINT "submission_submission_metadata_ids_submission_metadata_id_fk";
--> statement-breakpoint
ALTER TABLE "main"."assignment_status" DROP CONSTRAINT "assignment_status_assignment_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "main"."registered" DROP CONSTRAINT "registered_user_id_period_week_pk";--> statement-breakpoint
ALTER TABLE "main"."submission" DROP CONSTRAINT "submission_assignment_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "main"."assignment_status" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "main"."registered" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "main"."submission" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "main"."submission_metadata" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "main"."announcement_attachment_metadata_ids" ADD CONSTRAINT "announcement_attachment_metadata_ids_announcement_id_announcement_id_fk" FOREIGN KEY ("announcement_id") REFERENCES "main"."announcement"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."announcement_attachment_metadata_ids" ADD CONSTRAINT "announcement_attachment_metadata_ids_attachment_metadata_id_attachment_metadata_id_fk" FOREIGN KEY ("attachment_metadata_id") REFERENCES "main"."attachment_metadata"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."assignment_attachment_metadata_ids" ADD CONSTRAINT "assignment_attachment_metadata_ids_assignment_id_assignment_data_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "main"."assignment_data"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."assignment_attachment_metadata_ids" ADD CONSTRAINT "assignment_attachment_metadata_ids_attachment_metadata_id_attachment_metadata_id_fk" FOREIGN KEY ("attachment_metadata_id") REFERENCES "main"."attachment_metadata"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."submission_metadata_ids" ADD CONSTRAINT "submission_metadata_ids_submission_id_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "main"."submission"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."submission_metadata_ids" ADD CONSTRAINT "submission_metadata_ids_submission_metadata_id_submission_metadata_id_fk" FOREIGN KEY ("submission_metadata_id") REFERENCES "main"."submission_metadata"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."student_attribute" ADD CONSTRAINT "student_attribute_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "better_auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."submission_metadata" ADD CONSTRAINT "submission_metadata_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "better_auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."announcement" DROP COLUMN "attachments_metadata_ids";--> statement-breakpoint
ALTER TABLE "main"."assignment_data" DROP COLUMN "attachments_metadata_ids";--> statement-breakpoint
ALTER TABLE "main"."submission" DROP COLUMN "submission_metadata_ids";--> statement-breakpoint
ALTER TABLE "main"."assignment_status" ADD CONSTRAINT "assignment_status_assignment_id_user_id_unique" UNIQUE("assignment_id","user_id");--> statement-breakpoint
ALTER TABLE "main"."registered" ADD CONSTRAINT "registered_user_id_period_week_unique" UNIQUE("user_id","period","week");--> statement-breakpoint
ALTER TABLE "main"."submission" ADD CONSTRAINT "submission_assignment_id_user_id_unique" UNIQUE("assignment_id","user_id");