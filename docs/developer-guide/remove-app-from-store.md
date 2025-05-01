# How to Remove an App from the Store

## Android

* Open the [Play Console](https://play.google.com/console)
* Select the app
* Go to Test and release >> Setup >> Advanced settings in the left-hand menu
* Under App availability choose Unpublish

### Notes on unpublishing in the Play Store

From [support.google.com](https://support.google.com/googleplay/android-developer/answer/9859350?sjid=7879270871870126559-NA#unpublish):

> When you unpublish an app, existing users can still use your app and receive app updates, but new users won't find and download it on Google Play.



## iOS

* Open [App Store Connect](https://appstoreconnect.apple.com/)
* Select the app
* On the Distribution tab, go to General >> App Information
* At the bottom, under Additional Information, choose Remove App

NB: "This app name will be released for other developers to use, and the app will be moved to your Removed Apps list."

If you get the error "This app cannot be removed", you can still remove availability:
* Under Monitization, choose Pricing and Availability
* Choose Manage
* Choose Manage Availability and remove availability from all regions

### Notes on unpublishing on the App Store

From [developer.apple.com](https://developer.apple.com/help/app-store-connect/create-an-app-record/remove-an-app):

> If you remove an app, you’ll lose ownership of the app name. Removed apps can only be restored if the name isn’t currently in use by another developer account. In addition, the SKU can’t be reused in the same organization and if you’ve uploaded a build, your bundle ID can’t be reused.
