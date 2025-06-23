CREATE TABLE "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"sender_email" text NOT NULL,
	"receiver_email" text NOT NULL,
	"subject" text,
	"text" text,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp NOT NULL
);
