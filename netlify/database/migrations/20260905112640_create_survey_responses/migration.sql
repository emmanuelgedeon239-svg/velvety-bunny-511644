CREATE TABLE "survey_responses" (
	"id" serial PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"age_range" text NOT NULL,
	"country" text NOT NULL,
	"education_level" text NOT NULL,
	"field_of_study" text,
	"stress_frequency" text NOT NULL,
	"stress_level" integer NOT NULL,
	"stress_sources" jsonb NOT NULL,
	"main_stress_source" text NOT NULL,
	"stress_description" text,
	"coping_methods" jsonb NOT NULL,
	"coping_effectiveness" text NOT NULL,
	"missing_support" text,
	"desired_features" jsonb NOT NULL,
	"regular_usage_motivation" text,
	"future_solution_interest" text NOT NULL
);
