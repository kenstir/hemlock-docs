# How to Enable Fastlane for App Deployment

## Android

### Enable API access

* Open the [Google Play Developer API page](https://console.developers.google.com/apis/api/androidpublisher.googleapis.com/)
* Select the project in the top bar
* Click `Enable` to enable the API

### Create a Service Account

* Go to the [Google Cloud Console](https://console.cloud.google.com/iam-admin/serviceaccounts)
* Click `+ Create Service Account` at the top
* Leave the display name blank
* Set ID to "**project-name**-fastlane"
* Set Description to "Service account for fastlane deployment"
* Click `Create and Continue`
* Click `Continue` (no role needed)
* Click `Done`

### Add a Service Account Key

**Be prepared to store the key securely** - this procedure immediately downloads the new key to your computer.

Create a key:
* Click the 3 dots at the right of the service account we just created, and select `Manage keys`
* From the `Add Key` menu, select `Create new key`
* Chose JSON
* Click `Create` to create and download the key
* Rename the key to `secret/**project-name**-fastlane.json`

### Bootstrap Fastlane in the repo

* Copy the fastlane files from an existing app to the app directory
  ```bash
  p=pines
  mkdir -p ${p}_app/fastlane/metadata/android/en-US/changelogs
  cp hemlock_app/fastlane/*file ${p}_app/fastlane/
  ```
* Edit `Appfile` to fix package name and json key path
  ```
  perl -p -i -e "s/hemlock/${p}/g" ${p}_app/fastlane/Appfile
  ```

### Invite the service account to the Play Console

* Open the [Play Console](https://play.google.com/console)
* Choose `Users and permissions` from the left menu
* Click `Invite new user`
* Use the service account email (from the JSON key file)
* Under App permissions, select `Add app`
* Select the app
* Grant `Admin (all permissions)` access
* Click `Invite user`

### Test Fastlane access

```bash
cd ${p}_app
fastlane run validate_play_store_json_key
```
