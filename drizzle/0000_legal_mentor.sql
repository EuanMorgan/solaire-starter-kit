CREATE TABLE "solaire_account" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"id_token" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "solaire_post" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text,
	"published" boolean DEFAULT false NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "solaire_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "solaire_session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "solaire_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "solaire_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "solaire_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "solaire_account" ADD CONSTRAINT "solaire_account_user_id_solaire_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."solaire_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solaire_post" ADD CONSTRAINT "solaire_post_user_id_solaire_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."solaire_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solaire_session" ADD CONSTRAINT "solaire_session_user_id_solaire_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."solaire_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "solaire_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "account_provider_idx" ON "solaire_account" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE INDEX "post_user_id_idx" ON "solaire_post" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "solaire_session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_token_idx" ON "solaire_session" USING btree ("token");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "solaire_user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "solaire_verification" USING btree ("identifier");