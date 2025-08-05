# Supabase Setup Guide - Detailed Steps

## 1. Create Supabase Account & Project

### Step 1: Sign Up
1. Go to https://supabase.com
2. Click "Start your project" button
3. Sign up with GitHub or email
4. Verify your email if needed

### Step 2: Create New Project
1. Click "New project" button
2. Fill in the form:
   - **Organization**: Select your organization or create new one
   - **Project name**: `stoppr-deriv` (or your preferred name)
   - **Database Password**: Create a strong password and **SAVE IT** (you'll need it later)
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Free tier is fine for development
3. Click "Create new project"
4. Wait 1-2 minutes for project to be provisioned

## 2. Get Your API Keys

### Step 1: Navigate to API Settings
1. Once project is ready, you'll see the dashboard
2. In left sidebar, click "Settings" (gear icon)
3. Under Configuration, click "API"

### Step 2: Copy Your Credentials
You'll see several keys. You need these two:
1. **Project URL**: 
   - Look for "Project URL" section
   - Copy the URL (looks like: `https://abcdefghijklmnop.supabase.co`)
2. **Anon/Public Key**:
   - Look for "Project API keys" section
   - Copy the `anon` `public` key (long string starting with `eyJ...`)
   - ⚠️ DO NOT copy the `service_role` key (that's secret!)

## 3. Create .env file in Your Project

### Step 1: Create the File
1. In your project root (same folder as package.json), create a new file named `.env`
2. Add these lines with YOUR values:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-long-key-here
```

### Step 2: Verify .gitignore
Make sure `.env` is in your `.gitignore` file to keep it private:
```
.env
.env.local
```

## 4. Set Up Database Tables

### Step 1: Open SQL Editor
1. In Supabase dashboard left sidebar, click "SQL Editor"
2. Click "New query" button (or use the default query tab)

### Step 2: Run the Schema
1. Copy ALL the SQL code below
2. Paste it into the SQL editor
3. Click "Run" button (or press Ctrl/Cmd + Enter)
4. You should see "Success. No rows returned" message

**Copy this entire SQL block:**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    drinking_history TEXT,
    quit_goal TEXT,
    daily_limit INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create alcohol_logs table
CREATE TABLE IF NOT EXISTS public.alcohol_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    drink_type TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create onboarding_data table
CREATE TABLE IF NOT EXISTS public.onboarding_data (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    completed_steps TEXT[] DEFAULT '{}',
    triggers TEXT[] DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create user_streaks table
CREATE TABLE IF NOT EXISTS public.user_streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_check_in TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX idx_alcohol_logs_user_id ON public.alcohol_logs(user_id);
CREATE INDEX idx_alcohol_logs_timestamp ON public.alcohol_logs(timestamp);
CREATE INDEX idx_user_streaks_user_id ON public.user_streaks(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alcohol_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" 
    ON public.users FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON public.users FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
    ON public.users FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Alcohol logs policies
CREATE POLICY "Users can view own alcohol logs" 
    ON public.alcohol_logs FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alcohol logs" 
    ON public.alcohol_logs FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alcohol logs" 
    ON public.alcohol_logs FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own alcohol logs" 
    ON public.alcohol_logs FOR DELETE 
    USING (auth.uid() = user_id);

-- Onboarding data policies
CREATE POLICY "Users can view own onboarding data" 
    ON public.onboarding_data FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding data" 
    ON public.onboarding_data FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding data" 
    ON public.onboarding_data FOR UPDATE 
    USING (auth.uid() = user_id);

-- User streaks policies
CREATE POLICY "Users can view own streaks" 
    ON public.user_streaks FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streaks" 
    ON public.user_streaks FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks" 
    ON public.user_streaks FOR UPDATE 
    USING (auth.uid() = user_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email);
    
    INSERT INTO public.user_streaks (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_onboarding_data_updated_at BEFORE UPDATE ON public.onboarding_data
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_streaks_updated_at BEFORE UPDATE ON public.user_streaks
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

## 5. Enable OAuth Authentication

### Step 1: Navigate to Auth Settings
1. In left sidebar, click "Authentication"
2. Click "Providers" tab

### Step 2: Enable OAuth Providers

**🎯 Recommendation for Testing:**
- Start with **Google OAuth only** (free and easier)
- Add Apple Sign In later when going to production
- The "Skip for now" option lets users try the app without any auth

Choose which OAuth providers you want to enable:

#### For Google OAuth (Easier to set up):

**📱 Why "Web application" for a Mobile App?**
OAuth in mobile apps works through web views:
1. App opens a web browser/view for sign-in
2. User signs in on Google's website
3. Google redirects to Supabase's web endpoint
4. Supabase sends the auth token back to your app

This is standard for all mobile OAuth implementations!

**Step 1: Create Google Cloud Project**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click "Select a project" → "New Project"
4. Name it (e.g., "Stoppr App") → "Create"
5. Wait for project creation (takes ~30 seconds)

**Step 2: Enable OAuth**
1. In the left menu, go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type → "Create"
3. Fill in required fields:
   - App name: "Stoppr"
   - User support email: Your email
   - Developer contact: Your email
4. Click "Save and Continue"
5. Skip scopes (click "Save and Continue")
6. Add test users if needed → "Save and Continue"

**Step 3: Create OAuth Credentials**
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Web application" ⚠️ **(Yes, even for mobile apps!)**
   - This is because Supabase handles OAuth through web redirects
   - Your mobile app opens a web view for Google sign-in
   - After auth, it redirects back through Supabase's web endpoint
4. Name: "Stoppr Supabase Auth"
5. Under "Authorized redirect URIs", add:
   ```
   https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback
   ```
   (Get YOUR-PROJECT-ID from Supabase dashboard URL)
6. Click "Create"
7. Copy the **Client ID** and **Client Secret**

**Step 4: Add to Supabase**
1. In Supabase, go to Authentication → Providers → Google
2. Toggle ON
3. Paste your Client ID and Client Secret
4. Check ✅ "Enable Sign in with Google"
   - This enables the Google sign-in functionality
   - Works for both web views and native Android apps
   - Required for OAuth to work properly
5. Leave other settings as default (no need for "Skip nonce checks")
6. Click "Save"

#### For Apple OAuth (Requires Apple Developer Account - $99/year):

**⚠️ IMPORTANT**: You need an Apple Developer Account ($99/year) to use Sign in with Apple. You do NOT need an Apple device - you can do everything from a Windows PC through the web portal.

**Without Apple Device?**
- ✅ YES, you can use Apple Developer Portal on Windows/PC
- ✅ All configuration is done through web browser
- ❌ You'll need to pay $99/year for developer account
- 💡 Consider starting with just Google OAuth if you're testing

**If you have Apple Developer Account:**

**Step 1: Create App ID**
1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Sign in → Certificates, IDs & Profiles
3. Click "Identifiers" → "+" button
4. Choose "App IDs" → Continue
5. Select "App" → Continue
6. Fill in:
   - Description: "Stoppr App"
   - Bundle ID: "com.yourcompany.stoppr" (reverse domain)
7. Under Capabilities, check "Sign in with Apple"
8. Register

**Step 2: Create Service ID**
1. Still in Identifiers, click "+" again
2. Choose "Services IDs" → Continue
3. Fill in:
   - Description: "Stoppr Auth"
   - Identifier: "com.yourcompany.stoppr.auth"
4. Register
5. Click on your new Service ID
6. Check "Sign in with Apple"
7. Click "Configure":
   - Primary App ID: Select your app
   - Domains: `YOUR-PROJECT-ID.supabase.co`
   - Return URLs: `https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback`
8. Save

**Step 3: Create Private Key**
1. Go to "Keys" → "+" button
2. Key Name: "Stoppr Auth Key"
3. Check "Sign in with Apple"
4. Configure → Select your app → Save
5. Continue → Register
6. **DOWNLOAD THE KEY FILE** (you can only download once!)

**Step 4: Get Your IDs**
- **Team ID**: Top right of developer portal (looks like "A1B2C3D4E5")
- **Service ID**: The one you created (com.yourcompany.stoppr.auth)
- **Key ID**: From the key you just created (10 characters)
- **Private Key**: Contents of the .p8 file you downloaded

**Step 5: Add to Supabase**
1. In Supabase, go to Authentication → Providers → Apple
2. Toggle ON
3. Fill in all the fields:
   - Service ID (e.g., com.yourcompany.stoppr.auth)
   - Team ID (from Apple Developer portal)
   - Key ID (from your Sign in with Apple key)
   - Private Key (contents of .p8 file)
4. **IMPORTANT for iOS**: Check ✅ "Skip nonce checks"
   - This is required for iOS apps
   - Apple's iOS SDK doesn't provide the nonce to third-party auth providers
   - Without this, Apple Sign In will fail on iOS devices
5. Click "Save"

#### For GitHub OAuth (good for testing):
1. Find "GitHub" in the list of providers
2. Toggle the switch to enable it
3. You'll need:
   - **Client ID**: From GitHub OAuth App settings
   - **Client Secret**: From GitHub OAuth App settings
   - Follow the [GitHub OAuth setup guide](https://supabase.com/docs/guides/auth/social-login/auth-github)
4. Click "Save"

### Step 3: Configure Redirect URLs
1. In the OAuth provider settings, you'll see "Redirect URLs"
2. For Expo development, add:
   - `exp://localhost:19000`
   - Your production URL when ready

### Step 4: Disable Email Provider (Optional)
If you ONLY want OAuth:
1. Find "Email" in the providers list
2. Toggle it OFF
3. Click "Save"

## 6. Verify Your Setup

### Step 1: Check Tables Were Created
1. In left sidebar, click "Table Editor"
2. You should see these tables:
   - `users`
   - `alcohol_logs`
   - `onboarding_data`
   - `user_streaks`

### Step 2: Test in Your App
1. Make sure your `.env` file has the correct values
2. Restart your Expo development server:
   ```bash
   # Stop the server (Ctrl+C) then:
   npm start
   ```
3. Check the console - you should NOT see the "Supabase is disabled" message
4. If you still see it, double-check your `.env` file

## 7. Common Issues & Solutions

### Issue: "Supabase is disabled for development"
- **Solution**: Make sure `.env` file exists and has correct values
- Restart Expo after creating `.env`

### Issue: Tables not showing in Table Editor
- **Solution**: Make sure you ran ALL the SQL code
- Check SQL Editor history for any errors

### Issue: Can't find API keys
- **Solution**: Settings → API → Look for "anon" key under "Project API keys"

### Issue: OAuth redirect not working
- **Solution**: Make sure redirect URL in provider matches EXACTLY:
  - For development: Use `exp://localhost:19000`
  - URL must include `https://` and match your Supabase project ID
  
### Issue: Google OAuth "Access blocked" error
- **Solution**: In Google Cloud Console:
  - OAuth consent screen → Publishing status → Publish app
  - Or add your email as a test user

### Issue: Apple Sign In without Apple device
- **Solution**: You can use Windows/PC browser for everything
- **Alternative**: Start with Google OAuth only (free)

## 8. Production OAuth Setup

When you're ready to publish to App Store/Google Play, you'll need to:

### For iOS Production:
1. In `app.json`, add your custom URL scheme:
   ```json
   "expo": {
     "scheme": "stoppr",
     "ios": {
       "bundleIdentifier": "com.yourcompany.stoppr"
     }
   }
   ```
2. Update OAuth redirect URLs in providers to include your custom scheme
3. Configure Associated Domains for Apple Sign In

### For Google OAuth in Production:
1. In Google Cloud Console, add your app's SHA-1 certificate
2. Create separate OAuth credentials for:
   - iOS: Use bundle identifier
   - Android: Use package name + SHA-1
3. Update redirect URLs for production

## 9. Next Steps
Once everything is set up:
1. Your app will automatically use Supabase for authentication
2. User registration will create entries in the database
3. All tracking data will be saved to Supabase

**Important Security Note**: 
- Never commit your `.env` file to Git
- The `anon` key is safe to use in frontend code
- Never use the `service_role` key in frontend code