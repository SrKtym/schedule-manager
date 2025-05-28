ALTER TABLE "settings" ALTER COLUMN "theme" SET DEFAULT 'light';--> statement-breakpoint
ALTER TABLE "settings" ALTER COLUMN "theme" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ALTER COLUMN "notification" SET DEFAULT 'on';--> statement-breakpoint
ALTER TABLE "settings" ALTER COLUMN "notification" SET NOT NULL;