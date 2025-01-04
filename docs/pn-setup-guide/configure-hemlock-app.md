---
sidebar_position: 2
---
# Configure the Hemlock app

This guide is for the mobile app developer.

## Configure the Android app

**TODO**

## Configure the iOS app

* Download the GoogleService-Info.plist file from the [Firebase Console](https://console.firebase.google.com/) (click the gear and choose "Project settings") and store it under the app (e.g. Source/pines_app/)
* Add the GoogleService-Info.plist file to the project
* Add the FCM entitlements to the project
  * In the Project navigator, click Hemlock
  * Choose the project, e.g. PINES
  * Click "+ Capability" and add the "Push Notifications" capability
  * Click "+ Capability" and add the "Background Modes" capability, then select "Remote notifications"
  * For cleanliness, move the newly created .entitlements file (drag it in Xcode to Source/pines_app/)
  * Close Xcode, then edit the project.pbxproj to fix the relative path `CODE_SIGN_ENTITLEMENTS = Source/pines_app/PINES.entitlements;`
* Define `USE_FCM` (or `USE_FA`) in the Build Settings of the project
  * Under "Build Settings", find "Swift Compiler - Custom Flags"
  * Under "Active Compilation Conditions", add "USE_FCM" for Any Architecture | Any SDK
* Configure for DWARF with dSYM files
  * Under "Build Settings", find "Build Options"
  * For "Debug Information Format", choose "DWARF with dSYM files"
* Add Firebase packages to project
  * Under "General", find "Frameworks, Libraries, and Embedded Content"
  * Click "+" and add projects
    - FirebaseAnalyticsWithoutAdIdSupport
    - FirebaseCrashlytics
  * NB: If you don't see the package you may need to quick Xcode and maybe delete the directory `~/Library/Developer/Xcode/DerivedData`
* Configure Xcode to produce and upload dSYMs for Crashlytics per the [Firebase instructions](https://firebase.google.com/docs/crashlytics/get-started?platform=ios#set-up-dsym-uploading)
* Optionally enable the Firebase Console Debug View by adding `-FIRDebugEnabled` and `-FIRDebugDisabled` to your build scheme per the [Crashlytics >> Test your implementation](https://firebase.google.com/docs/crashlytics/test-implementation?platform=ios)
