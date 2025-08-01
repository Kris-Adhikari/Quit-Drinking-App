# CLAUDE.md

Create a React Native/Expo mobile app MVP for a quit alcohol tracker designed for those looking to reduce or quit alcohol consumption with the following stack and requirements:

## TECH STACK:
- React Native with Expo and Expo Router for navigation
- Supabase for backend, database, and authentication
- RevenueCat for subscription payments and management
- Superwall for paywalls and A/B testing
- TypeScript throughout

## ARCHITECTURE & CODE STYLE:
- Use Expo Router for both native app and website
- API routes in src/app/api/ directory with +api.ts suffix (e.g., chat+api.ts)
- Use kebab-case for all file names, avoid capital letters
- Use @/ path aliases for imports from src directory
- TypeScript strict mode enabled
- Never use EXPO_PUBLIC_ prefix for sensitive environment variables

## PROJECT STRUCTURE:
- Root src/ directory
- Expo Router file-based routing in src/app/
- Components in src/components/ with ui/, auth/, paywall/, tracking/ subdirectories
- Hooks in src/hooks/ (use-auth.ts, use-subscription.ts, use-alcohol-tracking.ts, etc.)
- Types in src/types/
- Library integrations in src/lib/

## MVP FEATURES:
- User onboarding flow (drinking habits, goals, triggers)
- Daily alcohol intake manual logging
- Simple daily tracking dashboard
- Basic progress view (daily/weekly alcohol intake)
- Streak tracking and milestones
- Authentication and user profiles

## REQUIRED SCREENS:
1. Onboarding flow (3-4 screens for user setup)
2. Main dashboard (today's alcohol intake, quick actions)
3. Add alcohol intake (manual entry)
4. Progress/history view
5. Settings/profile

## REQUIRED INTEGRATIONS:
1. Supabase client setup with authentication and database for user data and tracking
2. RevenueCat SDK for premium features subscription
3. Superwall for premium feature paywalls (advanced analytics, personalized insights)

## BASIC DATABASE SCHEMA:
- Users table (id, email, drinking_history, quit_goal, daily_limit)
- Alcohol_logs table (id, user_id, amount, drink_type, timestamp)
- Onboarding_data table (user_id, completed_steps, triggers, preferences)

## ENVIRONMENT SETUP:
- Create proper .env structure for Supabase, RevenueCat, and Superwall keys
- Set up environment variables correctly (public vs private)

Create the basic MVP app structure with functional onboarding, manual alcohol tracking, and basic dashboard. Include essential configuration files and integration setup files. Keep it simple and focused on core alcohol tracking functionality.