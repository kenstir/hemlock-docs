# Debugging Guide for Acorn App Push Notifications

This guide provides steps to troubleshoot issues with push notifications in the Acorn app using the `hemlock-sendmsg` daemon. Follow these steps to identify and resolve problems with notifications on both iOS and Android devices.

## Common Issues
1. **Notifications not received on iOS or Android.**
2. **Notifications received, but they do not open the correct screen.**
3. **Push notifications work on one platform but not the other.**
4. **Receiving errors when sending push notifications manually.**

## General Debugging Steps

### 1. Verify Build and Device Registration
- Ensure that the device has the correct build version of the app:
  - **Android:** Version should be 3.1.0.6. Check via `Play Store >> Profile Icon >> Manage apps & device >> Acorn >> About this app`.
  - **iOS:** Version should be 3.1.0 (2). Check via TestFlight or App Store.
- Confirm the device is registered to receive push notifications:
  - Only one device can be registered for push notifications per patron account. The last device to log in will be the active one.

### 2. Check Notification Permissions
- Ensure that notifications are enabled for the app:
  - **iOS:** Go to `Settings >> Notifications >> Acorn Catalog` and allow notifications.
  - **Android:** Ensure notification permissions are granted in `Settings >> Apps >> Acorn >> Notifications`.

### 3. Test Push Notifications Manually
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
  
- Check for errors:
  - If you see "Auth error from APNS or Web Push Service," ensure the APNs Authentication Key is correctly configured in the Firebase project.

### 4. Verify `hemlock-sendmsg` Daemon Status
- Ensure the `hemlock-sendmsg` daemon is updated to the latest version.
- Restart the daemon after pulling the latest code:
  ~~~bash
  git pull
  make
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

### 5. Confirm Action Trigger Configuration
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

### 6. Verify Firebase and APNs Configuration
- Ensure that the Firebase project has the correct APNs key and Team ID set up.
- If notifications work for some types but not others, ensure that all notification types are registered correctly in the app's source code.

## Specific Troubleshooting Steps for Common Scenarios

### A. iOS Notifications Not Working
1. Ensure the device is the last one to sign in.
2. Verify the APNs configuration in Firebase.
3. Test manually with `curl` and check for errors related to authentication.

### B. Android Notifications Not Working
1. Verify that the app build is up-to-date.
2. Check notification channels registered in the app's settings.
3. Ensure the daemon sets the `type` correctly for selective disabling by channel.

### C. Notifications Open Incorrect Screens
1. Ensure the `type` parameter in the action trigger is correct.
2. Verify that the app's code correctly handles the `type` parameter and routes to the appropriate screen.

### D. Errors When Sending Notifications Manually
1. Check for missing or incorrect parameters in the `curl` command.
2. Ensure that the `hemlock-sendmsg` daemon is updated and configured properly.

## Additional Notes
- The `hemlock-sendmsg` daemon has a new feature that allows filtering out patrons who do not have accounts in the app (EmptyToken metric). Refer to the [README](https://github.com/kenstir/hemlock-sendmsg/blob/main/README.md#collecting-metrics) for more details.
