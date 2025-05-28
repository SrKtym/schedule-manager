ALTER TABLE "settings" ALTER COLUMN "theme" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "settings" ALTER COLUMN "theme" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ALTER COLUMN "notification" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "settings" ALTER COLUMN "notification" DROP NOT NULL;