CREATE TYPE "public"."credit" AS ENUM('1', '2', '4');--> statement-breakpoint
CREATE TYPE "public"."department" AS ENUM('史学科', '哲学科', '心理学科', '文学科', '経済学科', '経営学科', '法律学科', '政治学科', '教育学科', '社会学科', '社会心理学科', '数学科', '物理学科', '化学科', '生物学科', '地学科', '情報工学科', '機械工学科', '電気工学科', '建築学科', '生物資源学科', '森林学科', '医学科', '看護学科', '保健学科');--> statement-breakpoint
CREATE TYPE "public"."faculty" AS ENUM('文学部', '経済学部', '法学部', '教育学部', '社会学部', '理学部', '工学部', '農学部', '医学部');--> statement-breakpoint
CREATE TYPE "public"."grade" AS ENUM('1学年', '2学年', '3学年', '4学年');--> statement-breakpoint
CREATE TYPE "public"."notification" AS ENUM('on', 'off');--> statement-breakpoint
CREATE TYPE "public"."period" AS ENUM('1限目', '2限目', '3限目', '4限目', '5限目');--> statement-breakpoint
CREATE TYPE "public"."required" AS ENUM('必修', '選択必修', '任意');--> statement-breakpoint
CREATE TYPE "public"."theme" AS ENUM('light', 'dark');--> statement-breakpoint
CREATE TYPE "public"."week" AS ENUM('月曜日', '火曜日', '水曜日', '木曜日', '金曜日');--> statement-breakpoint
CREATE TABLE "accounts" (
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
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "attribute" (
	"email" text PRIMARY KEY NOT NULL,
	"grade" "grade" NOT NULL,
	"faculty" "faculty" NOT NULL,
	"department" "department" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course" (
	"name" text PRIMARY KEY NOT NULL,
	"week" "week" NOT NULL,
	"period" "period" NOT NULL,
	"targetGrade" "grade" NOT NULL,
	"targetFaculty" "faculty",
	"targetDepartment" "department",
	"credit" "credit" NOT NULL,
	"required" "required" NOT NULL,
	"classroom" text NOT NULL,
	"professor" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "course" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"sender_email" text NOT NULL,
	"receiver_email" text NOT NULL,
	"subject" text,
	"body" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "passkeys" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"public_key" text NOT NULL,
	"user_id" text NOT NULL,
	"credential_id" text NOT NULL,
	"counter" integer NOT NULL,
	"device_type" text NOT NULL,
	"backed_up" boolean NOT NULL,
	"transports" text,
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "registered" (
	"name" text NOT NULL,
	"email" text NOT NULL,
	"period" "period" NOT NULL,
	"week" "week" NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	CONSTRAINT "registered_period_week_unique" UNIQUE("period","week")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"email" text PRIMARY KEY NOT NULL,
	"theme" "theme" DEFAULT 'light' NOT NULL,
	"notification" "notification" DEFAULT 'on' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "two_factors" (
	"id" text PRIMARY KEY NOT NULL,
	"secret" text NOT NULL,
	"backup_codes" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"username" text,
	"display_username" text,
	"two_factor_enabled" boolean,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "verifications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attribute" ADD CONSTRAINT "attribute_email_users_email_fk" FOREIGN KEY ("email") REFERENCES "public"."users"("email") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passkeys" ADD CONSTRAINT "passkeys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registered" ADD CONSTRAINT "registered_name_course_name_fk" FOREIGN KEY ("name") REFERENCES "public"."course"("name") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registered" ADD CONSTRAINT "registered_email_users_email_fk" FOREIGN KEY ("email") REFERENCES "public"."users"("email") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settings" ADD CONSTRAINT "settings_email_users_email_fk" FOREIGN KEY ("email") REFERENCES "public"."users"("email") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "two_factors" ADD CONSTRAINT "two_factors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE VIEW "public"."schedule_view" AS (select "name" from "registered");--> statement-breakpoint
CREATE POLICY "policy on accounts" ON "accounts" AS PERMISSIVE FOR ALL TO current_user, session_user USING ("users"."email_verified" = true 
        AND "users"."id" = "accounts"."user_id") WITH CHECK ("users"."email_verified" = true
        AND "users"."id" = "accounts"."user_id");--> statement-breakpoint
CREATE POLICY "policy on course" ON "course" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "policy on users" ON "users" AS PERMISSIVE FOR ALL TO session_user USING ("users"."email_verified" = true 
        AND "users"."id" = "accounts"."user_id") WITH CHECK ("users"."email_verified" = true
        AND "users"."id" = "accounts"."user_id");--> statement-breakpoint
CREATE POLICY "policy on verification" ON "verifications" AS PERMISSIVE FOR ALL TO public;