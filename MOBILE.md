# Mobile App Guide

This application is configured with **Capacitor** to run as a native Android app.

## How to get the APK

### Option 1: Automatic Build (Recommended)
Since you are using GitHub, an automated workflow has been set up.
1.  Push your changes to GitHub.
2.  Go to the **Actions** tab in your repository.
3.  Click on the latest "Build Android APK" run.
4.  Scroll down to **Artifacts** and download `app-debug`. This zip file contains the `.apk` file you can install on your phone.

### Option 2: Build Locally
If you have Android Studio installed:
1.  Run `npx cap open android`
2.  Wait for Android Studio to open the project.
3.  Click the "Run" button (green play icon) to launch on an emulator, or "Build > Build Bundle(s) / APK(s) > Build APK(s)" to generate the file.

### Option 3: Command Line (Windows)
```bash
npx cap sync
cd android
./gradlew assembleDebug
```
The APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

## Testing Login
The app now requires a login.
-   **Email**: Any email (e.g., `test@example.com`)
-   **Password**: Any password
-   *(This is a mock login for demonstration purposes)*
