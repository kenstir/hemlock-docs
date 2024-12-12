---
sidebar_position: 3
---
# Push Notifications Troubleshooting Guide

This guide provides steps to troubleshoot issues with push notifications using the `hemlock-sendmsg` daemon. Follow these steps to identify and resolve problems with notifications on both iOS and Android devices.

## General Debugging Steps

### Verify App Version
<details>
Ensure that the device has the correct build version of the app:
- **Android:** Version should be at least 3.1.0.x. Check via `Play Store >> Profile Icon >> Manage apps & device >> Acorn >> About this app`.
- **iOS:** Version should be at least 3.1.0 (x). Check via TestFlight or App Store.
</details>

### Only One Device per Account
<details>
Only **one device per patron account** can be registered for push notifications. The last device to log in will be the active one.
</details>

### Check Notification Permissions
<details>
Ensure that notifications are enabled for the app:
- **iOS:** Go to `Settings >> Notifications >> Acorn Catalog` and allow notifications.
- **Android:** Ensure notification permissions are granted in `Settings >> Apps >> Acorn >> Notifications`.
</details>

### 3. Test Push Notifications Manually
<details>
- Use `curl` to manually send a push notification to the device:
  - Obtain the push notification token by querying the database.
  
    ```sql
    SELECT s.value AS "Push Notification Token" FROM actor.usr_setting s
    JOIN actor.usr u ON u.id=s.usr
    WHERE usrname='username' and s.name='hemlock.push_notification_data';
    ```
  
  - Use the following command, replacing `$token` with the actual token:
    ```bash
    curl -F token="$token" -F title="New Message" -F body="Test Notification" -F type=holds -F debug=1 http://localhost:8842/send
    ```
  
- Watch for errors in the `hemlock-sendmsg` output:
  ```bash
  sudo journalctl -fu hemlock-sendmsg
  ```
</details>

### Verify Latest `hemlock-sendmsg` Daemon
<details>
- Ensure the `hemlock-sendmsg` daemon is updated to the latest version.
- Restart the daemon after pulling the latest code:
  ~~~bash
  git pull
  make
  sudo make install
  sudo systemctl restart hemlock-sendmsg
  ~~~
- Check the daemon output for correct startup and notification processing:
  - Example of startup output:
    ~~~
    2024/09/11 15:03:34 INFO starting hemlock-sendmsg date=2024-09-10 commit=03031fad
    ~~~
  - Example of notification processing output:
    ~~~
    2024/09/05 11:10:02 INFO GET /send result=ok code=200 username=xxx title="xxx" type="holds" body="xxx" token=xxx
    ~~~
</details>

### Confirm Action Trigger Configuration
<details>
- Ensure that the action triggers are correctly configured in Evergreen:
  - Example action trigger for hold notifications:
    ~~~xml
    <Parameters>
      title Hold Ready for Pickup
      type holds
      body You have an item ready for pickup.
      token [%- helpers.get_user_setting(user.id, 'hemlock.push_notification_data') %]
      username [%- user.usrname %]
      debug 1
    </Parameters>
    ~~~
- Confirm that the `type` parameter is correctly set to target specific screens (`holds`, `checkouts`, etc.).
</details>

## Specific Troubleshooting Steps

### General Scenarios

#### iOS Notifications Not Working
<details>
1. Ensure the device is the last one to sign in (force quit the app and sign in again).
2. Test manually with `curl` and check for errors in the `hemlock-sendmsg` output.
</details>

#### Android Notifications Not Working
<details>
1. Ensure the device is the last one to sign in (force quit the app and sign in again).
1. Verify that the app build is up-to-date.
1. Check notification channels registered in the app's settings.
1. Ensure the daemon sets the `type` correctly for selective disabling by channel.
</details>

#### Notification Opens the Wrong Screen in the App
<details>
1. Ensure the `type` parameter in the action trigger is correct.
2. Verify that the app's code correctly handles the `type` parameter and routes to the appropriate screen.
3. (Android only) Verify the app is registering the channel (search for "notification_channel_register_checkouts_channel").
</details>

### Errors in the `hemlock-sendmsg` output

#### "Auth error from APNS or Web Push Service"
<details>
1. Ensure the APNs Authentication Key is correctly configured in the Firebase project.
</details>

### Errors in the app

#### "500 Error" after signing in
<details>
1. Ensure the User Setting Type is created.  After signing in, the app tries to store the push notification token in the database, and it gets this error if the User Setting Type is missing.  See [Push Notification Setup Guide](../pn-setup-guide/configure-evergreen.md).
</details>

## Additional Notes
- The `hemlock-sendmsg` daemon filters out requests with an empty `token` parameter, so it does not attempt to send a push notification to a patron that does not use the app.  The `EmptyToken` metric tracks the number of such requests. Refer to the [README](https://github.com/kenstir/hemlock-sendmsg/blob/main/README.md#collecting-metrics) for more details.
