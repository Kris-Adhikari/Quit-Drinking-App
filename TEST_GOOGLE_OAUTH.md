# Testing Google OAuth - Step by Step

## 1. Verify Your Setup

### Check .env file exists:
Make sure you have `.env` file in your project root with:
```
EXPO_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-key-here
```

### Check Supabase Dashboard:
1. Go to Authentication → Providers
2. Google should show "Enabled" ✅
3. Click on Google to verify Client ID and Secret are saved

## 2. Start Testing

### Step 1: Restart Expo
```bash
# Stop the server (Ctrl+C) then:
npm start
```

### Step 2: Open the App
1. Press `i` for iOS simulator or `a` for Android
2. Or scan QR code with Expo Go app

### Step 3: Test the Flow
1. Complete onboarding (or skip to see sign-in)
2. You'll see two buttons:
   - "Continue with Google"
   - "Skip for now"

### Step 4: Test Google Sign In
1. Tap "Continue with Google"
2. A browser window should open
3. Sign in with your Google account
4. Grant permissions
5. You should be redirected back to the app
6. Check if you're logged in!

## 3. Check if it Worked

### In Your App:
- You should be on the Daily screen
- No more sign-in prompts

### In Supabase Dashboard:
1. Go to Authentication → Users
2. You should see your Google email listed
3. Provider column should show "google"

## 4. Troubleshooting

### "Authentication is disabled in development mode"
- Your .env file is not loaded
- Restart Expo after creating .env

### Browser opens but nothing happens
- Check redirect URL in Google Console matches Supabase
- Make sure you clicked "Save" in Supabase after adding credentials

### "Access blocked" error
- In Google Cloud Console → OAuth consent screen
- Either publish the app OR add your email as test user

### Can't see Google button
- Make sure you saved all file changes
- Refresh the app (shake device → Reload)

## 5. Test Skip for Now
1. Sign out (if signed in)
2. Go back to sign-in screen
3. Tap "Skip for now"
4. Should go directly to Daily screen without auth

## What's Next?
Once Google OAuth works:
- ✅ Users can sign in with Google
- ✅ Their data syncs to Supabase
- ✅ Progress saves across devices
- ✅ You can start saving real data!