# How to Enable Fastlane

## Enable Android for App Deployment

### Enable API access

* Open the [Google Play Android Developer API page](https://console.developers.google.com/apis/api/androidpublisher.googleapis.com/)
* Select the project in the top bar
* Click `Enable` to enable the API
* Search for "Google Play Android Developer API" if there is no `Enable` or `Manage` button

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
* Move the key to `secret/**project-name**-fastlane.json`

### Invite the service account to the Play Console

* Open the [Play Console](https://play.google.com/console)
* Choose `Users and permissions` from the left menu
* Click `Invite new users`
* Use the service account email (from the JSON key file)
* Under App permissions, select `Add app`
* Select the app
* Grant `Admin (all permissions)` access
* Click `Invite user`

### Bootstrap Fastlane in the repo

* Copy the fastlane files from an existing app to the app directory
  ```bash
  p=pines
  mkdir -p ${p}_app/fastlane/metadata/android/en-US/changelogs
  cp noble_app/fastlane/*file ${p}_app/fastlane/
  ```
* Edit `Appfile` to fix package name and json key path
  ```
  perl -p -i -e "s/noble/${p}/g" ${p}_app/fastlane/Appfile
  ```

### Test Fastlane access

```bash
cd ${p}_app
fastlane run validate_play_store_json_key
```

## Enable Android to query Google Analytics

### Enable API access

* Open the [Google Analytics Data API page](https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com)
* Select the project in the top bar
* Click `Enable` to enable the API
* Search for "Google Analytics Data API" if there is no `Enable` or `Manage` button

### Copy the property ID to a local JSON files

* Navigate to the [Google Analytics](https://analytics.google.com/analytics/web) "property"
* Click the gear icon (Admin) on the lower left
* Click `Property details`
* Copy the PROPERTY ID in the upper right
* Create a json file `secret/**project-name**-info.json` with the following contents
  ```
  p=pines
  id=123456789
  cat > secret/${p}-info.json <<EOF
  {
    "fa_property_id": $id
  }
  EOF

### Invite the existing service account to the property

* Stay on the [Google Analytics](https://analytics.google.com/analytics/web) "property"
* Click the gear icon (Admin) on the lower left
* Click `Account access management`
* Click `+` then `Add users`
  - Enter the service account email address
  - Select role of "Viewer"

### Test Fastlane access

```bash
tools/fl $p print_active_users
```
