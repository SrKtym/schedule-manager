CREATE SCHEMA "better_auth";
--> statement-breakpoint
CREATE SCHEMA "main";
--> statement-breakpoint
CREATE TYPE "main"."announcement_type" AS ENUM('資料', 'アンケート', 'その他');--> statement-breakpoint
CREATE TYPE "main"."status" AS ENUM('未提出', '提出済', '評定済');--> statement-breakpoint
CREATE TYPE "main"."credit" AS ENUM('1', '2', '4');--> statement-breakpoint
CREATE TYPE "main"."days" AS ENUM('日', '月', '火', '水', '木', '金', '土');--> statement-breakpoint
CREATE TYPE "main"."department" AS ENUM('史学科', '哲学科', '心理学科', '文学科', '経済学科', '経営学科', '法律学科', '政治学科', '教育学科', '社会学科', '社会心理学科', '数学科', '物理学科', '化学科', '生物学科', '地学科', '情報工学科', '機械工学科', '電気工学科', '建築学科', '生物資源学科', '森林学科', '医学科', '看護学科', '保健学科');--> statement-breakpoint
CREATE TYPE "main"."faculty" AS ENUM('文学部', '経済学部', '法学部', '教育学部', '社会学部', '理学部', '工学部', '農学部', '医学部');--> statement-breakpoint
CREATE TYPE "main"."file_type" AS ENUM('PDFファイル', 'Wordファイル', 'Excelファイル', 'PowerPointファイル');--> statement-breakpoint
CREATE TYPE "main"."grade" AS ENUM('1学年', '2学年', '3学年', '4学年');--> statement-breakpoint
CREATE TYPE "main"."notification" AS ENUM('on', 'off');--> statement-breakpoint
CREATE TYPE "main"."period" AS ENUM('1限目', '2限目', '3限目', '4限目', '5限目');--> statement-breakpoint
CREATE TYPE "main"."required" AS ENUM('必修', '選択必修', '任意');--> statement-breakpoint
CREATE TYPE "main"."theme" AS ENUM('light', 'dark');--> statement-breakpoint
CREATE TYPE "main"."week" AS ENUM('月曜日', '火曜日', '水曜日', '木曜日', '金曜日');--> statement-breakpoint
CREATE TABLE "better_auth"."accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "better_auth"."passkeys" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"public_key" text NOT NULL,
	"user_id" text NOT NULL,
	"credential_id" text NOT NULL,
	"counter" integer NOT NULL,
	"device_type" text NOT NULL,
	"backed_up" boolean NOT NULL,
	"transports" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"aaguid" text
);
--> statement-breakpoint
CREATE TABLE "better_auth"."sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "better_auth"."two_factors" (
	"id" text PRIMARY KEY NOT NULL,
	"secret" text NOT NULL,
	"backup_codes" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "better_auth"."users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"username" text,
	"display_username" text,
	"role" text,
	"banned" boolean,
	"ban_reason" text,
	"ban_expires" timestamp,
	"two_factor_enabled" boolean,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "better_auth"."verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "main"."announcement" (
	"id" text PRIMARY KEY NOT NULL,
	"auther" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"course_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"type" "main"."announcement_type" NOT NULL,
	"attachments_metadata_ids" text[]
);
--> statement-breakpoint
CREATE TABLE "main"."assignment_data" (
	"id" text PRIMARY KEY NOT NULL,
	"course_name" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"points" integer NOT NULL,
	"due_date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"type" "main"."file_type",
	"attachments_metadata_ids" text[]
);
--> statement-breakpoint
CREATE TABLE "main"."assignment_status" (
	"assignment_id" text NOT NULL,
	"user_name" text NOT NULL,
	"course_name" text NOT NULL,
	"status" "main"."status" NOT NULL,
	"evaluated" integer,
	"user_id" text NOT NULL,
	CONSTRAINT "assignment_status_assignment_id_user_id_pk" PRIMARY KEY("assignment_id","user_id"),
	CONSTRAINT "status_check" CHECK (("main"."assignment_status"."status" != '評定済' AND "main"."assignment_status"."evaluated" IS NULL) OR 
        ("main"."assignment_status"."status" = '評定済' AND "main"."assignment_status"."evaluated" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "main"."attachment_metadata" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" "main"."file_type" NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "main"."attribute" (
	"user_id" text PRIMARY KEY NOT NULL,
	"grade" "main"."grade" NOT NULL,
	"faculty" "main"."faculty" NOT NULL,
	"department" "main"."department" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "main"."comment" (
	"id" text PRIMARY KEY NOT NULL,
	"assignment_id" text,
	"announcement_id" text,
	"user_name" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "main"."course" (
	"name" text PRIMARY KEY NOT NULL,
	"week" "main"."week" NOT NULL,
	"period" "main"."period" NOT NULL,
	"targetGrade" "main"."grade" NOT NULL,
	"targetFaculty" "main"."faculty",
	"targetDepartment" "main"."department",
	"credit" "main"."credit" NOT NULL,
	"required" "main"."required" NOT NULL,
	"classroom" text NOT NULL,
	"professor" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "main"."messages" (
	"id" text PRIMARY KEY NOT NULL,
	"sender_email" text NOT NULL,
	"receiver_email" text NOT NULL,
	"subject" text,
	"body" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "main"."registered" (
	"name" text NOT NULL,
	"period" "main"."period" NOT NULL,
	"week" "main"."week" NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "registered_user_id_period_week_pk" PRIMARY KEY("user_id","period","week")
);
--> statement-breakpoint
CREATE TABLE "main"."schedule" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text DEFAULT 'no title' NOT NULL,
	"start" timestamp (0) NOT NULL,
	"end" timestamp (0) NOT NULL,
	"description" text,
	"color" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "schedule_user_id_start_end_unique" UNIQUE("user_id","start","end")
);
--> statement-breakpoint
CREATE TABLE "main"."settings" (
	"user_id" text PRIMARY KEY NOT NULL,
	"theme" "main"."theme" DEFAULT 'light' NOT NULL,
	"notification" "main"."notification" DEFAULT 'on' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "main"."submission" (
	"assignment_id" text NOT NULL,
	"content" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"submission_metadata_ids" text[],
	"user_id" text NOT NULL,
	CONSTRAINT "submission_assignment_id_user_id_pk" PRIMARY KEY("assignment_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "main"."submission_metadata" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" "main"."file_type" NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "better_auth"."accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "better_auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "better_auth"."passkeys" ADD CONSTRAINT "passkeys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "better_auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "better_auth"."sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "better_auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "better_auth"."two_factors" ADD CONSTRAINT "two_factors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "better_auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."announcement" ADD CONSTRAINT "announcement_auther_course_professor_fk" FOREIGN KEY ("auther") REFERENCES "main"."course"("professor") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."announcement" ADD CONSTRAINT "announcement_course_name_course_name_fk" FOREIGN KEY ("course_name") REFERENCES "main"."course"("name") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."announcement" ADD CONSTRAINT "announcement_attachments_metadata_ids_attachment_metadata_id_fk" FOREIGN KEY ("attachments_metadata_ids") REFERENCES "main"."attachment_metadata"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."assignment_data" ADD CONSTRAINT "assignment_data_course_name_course_name_fk" FOREIGN KEY ("course_name") REFERENCES "main"."course"("name") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."assignment_data" ADD CONSTRAINT "assignment_data_attachments_metadata_ids_attachment_metadata_id_fk" FOREIGN KEY ("attachments_metadata_ids") REFERENCES "main"."attachment_metadata"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."assignment_status" ADD CONSTRAINT "assignment_status_assignment_id_assignment_data_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "main"."assignment_data"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."assignment_status" ADD CONSTRAINT "assignment_status_user_name_users_name_fk" FOREIGN KEY ("user_name") REFERENCES "better_auth"."users"("name") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."assignment_status" ADD CONSTRAINT "assignment_status_course_name_registered_name_fk" FOREIGN KEY ("course_name") REFERENCES "main"."registered"("name") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."assignment_status" ADD CONSTRAINT "assignment_status_user_id_registered_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "main"."registered"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."attribute" ADD CONSTRAINT "attribute_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "better_auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."comment" ADD CONSTRAINT "comment_assignment_id_assignment_data_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "main"."assignment_data"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."comment" ADD CONSTRAINT "comment_announcement_id_announcement_id_fk" FOREIGN KEY ("announcement_id") REFERENCES "main"."announcement"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."comment" ADD CONSTRAINT "comment_user_name_users_name_fk" FOREIGN KEY ("user_name") REFERENCES "better_auth"."users"("name") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."comment" ADD CONSTRAINT "comment_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "better_auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."registered" ADD CONSTRAINT "registered_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "better_auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."registered" ADD CONSTRAINT "registered_name_course_name_fk" FOREIGN KEY ("name") REFERENCES "main"."course"("name") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."schedule" ADD CONSTRAINT "schedule_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "better_auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."settings" ADD CONSTRAINT "settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "better_auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."submission" ADD CONSTRAINT "submission_assignment_id_assignment_data_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "main"."assignment_data"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."submission" ADD CONSTRAINT "submission_submission_metadata_ids_submission_metadata_id_fk" FOREIGN KEY ("submission_metadata_ids") REFERENCES "main"."submission_metadata"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "main"."submission" ADD CONSTRAINT "submission_user_id_registered_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "main"."registered"("user_id") ON DELETE cascade ON UPDATE no action;