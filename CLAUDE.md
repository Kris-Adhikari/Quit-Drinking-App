# CLAUDE.md

Create a React Native/Expo mobile app MVP for a stop sugar tracker designed for GLP-1 users and diabetics with the following stack and requirements:

## TECH STACK:
- React Native with Expo and Expo Router for navigation
- Supabase for backend, database, and authentication
- RevenueCat for subscription payments and management
- Superwall for paywalls and A/B testing
- TypeScript throughout
- Expo Camera for food photo capture
- Expo ImagePicker for photo selection

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
- Components in src/components/ with ui/, auth/, paywall/, tracking/, camera/ subdirectories
- Hooks in src/hooks/ (use-auth.ts, use-subscription.ts, use-sugar-tracking.ts, use-camera.ts, etc.)
- Types in src/types/
- Library integrations in src/lib/

## MVP FEATURES:
- User onboarding flow (diabetes type, GLP-1 usage, goals)
- Daily sugar intake manual logging
- Food photo capture with camera
- Basic sugar content scanning/detection from food photos
- Simple daily tracking dashboard
- Basic progress view (daily/weekly sugar intake)
- Authentication and user profiles

## REQUIRED SCREENS:
1. Onboarding flow (3-4 screens for user setup)
2. Main dashboard (today's sugar intake, quick actions)
3. Add sugar intake (manual entry + camera capture)
4. Camera screen for food photos
5. Progress/history view
6. Settings/profile

## REQUIRED INTEGRATIONS:
1. Supabase client setup with authentication and database for user data and tracking
2. RevenueCat SDK for premium features subscription
3. Superwall for premium feature paywalls (advanced analytics, AI food recognition)
4. Expo Camera for taking food photos
5. Basic image processing for sugar content detection (placeholder for AI integration)

## BASIC DATABASE SCHEMA:
- Users table (id, email, diabetes_type, glp1_usage, daily_sugar_goal)
- Sugar_logs table (id, user_id, amount, source, photo_url, timestamp)
- Onboarding_data table (user_id, completed_steps, preferences)

## ENVIRONMENT SETUP:
- Create proper .env structure for Supabase, RevenueCat, and Superwall keys
- Set up environment variables correctly (public vs private)
- Configure camera permissions

Create the basic MVP app structure with functional onboarding, manual sugar tracking, camera integration for food photos, and basic dashboard. Include essential configuration files and integration setup files. Keep it simple and focused on core sugar tracking functionality.