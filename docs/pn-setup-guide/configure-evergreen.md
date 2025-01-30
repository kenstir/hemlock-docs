---

sidebar_position: 4
---
# Configure Evergreen Action Triggers

This guide is for the Evergreen Administrator.
It will help you set up your Evergreen (EG) server for sending a push notifications with an action trigger.  It assumes that your System Administrator has already installed the `hemlock-sendmsg` daemon, and it's listening on `localhost:8842`.

The process is:
* Create User Setting Types
* Create an Action Trigger

## Create User Setting Types

This procedure creates two new User Setting Types for the app to store its push notification token and an enabled flag.  The token uniquely identifies the app installation, and is required to send a push notification to a specific patron account.  The boolean flag can be used as an opt-in setting type on any action triggers that send push notifications.

As an EG admin, login to the Staff client and go to Server Administration >> User Setting Types.

Procedure:
* Click `New User Setting Type`
* Set the following form values:

    | Label               | Value                                                                              |
    | ------------------- | ---------------------------------------------------------------------------------- |
    | Datatype            | string                                                                             |
    | Description         | Used by the Hemlock app to store a patron's push notification token                |
    | Label               | Hemlock Push Notification Data                                                     |
    | Name                | hemlock.push_notification_data                                                     |
    | OPAC/Patron Visible | checked                                                                            |

* Click `Save`
* Click `New User Setting Type`
* Set the following form values:

    | Label               | Value                                                                              |
    | ------------------- | ---------------------------------------------------------------------------------- |
    | Datatype            | bool                                                                               |
    | Description         | Used by the Hemlock app to flag that a patron has a push notification token        |
    | Label               | Hemlock Push Notification Enabled                                                  |
    | Name                | hemlock.push_notification_enabled                                                  |
    | OPAC/Patron Visible | checked                                                                            |

* Click `Save`

## Create an Action Trigger

This procedure adds an action trigger to a demo server loaded with the concerto sample data.
The action trigger uses the CallHTTP reactor to send a request to the hemlock-sendmsg daemon to send the push notification.

As an EG admin, login to the Staff client and go to Local Administration >> Notifications / Action Triggers.

Checkout the [Evergreen Action Trigger documentation](https://docs.evergreen-ils.org/docs/latest/admin/actiontriggers.html) for more information.

### Cloning an Existing Action Trigger

:::tip
Cloning an existing action trigger is a good way to start especially if you are not familiar with action triggers. It is easier to modify an existing action trigger than to create one from scratch and can help reduce errors and save time on troubleshooting.
 - Make sure that you clone a working action trigger.
 - Clone an action trigger that uses the same hook as the one you want to create.
:::

1. Right click an existing event definition and click `Clone Selected` or select the event definition and click `Clone Selected` from the Actions menu.
2. When prompted to clone the environment, select `Yes`.
3. Set the reactor to `CallHTTP`.
4. Set the template according to the [sample template](#sample-template) below.

### Creating an Action Trigger from Scratch

:::warning
Creating an action trigger from scratch can be tricky as the environment and parameters of action triggers can be complex. Only create an action trigger from scratch if you are certain you can do so.
:::

This example event definition is for a courtesy notice. Some details may need to be adjusted for your specific use case. It is most important to set the reactor to `CallHTTP` and the template according to the [sample template](#sample-template) below.

* Click `New Event Definition`
* Set the following form values:

    | Label                          | Value                          |
    | ------------------------------ | ------------------------------ |
    | Owning Library                 | CONS                           |
    | Hook                           | checkout.due                   |
    | Processing Delay               | -300 days                      |
    | Processing Delay Context Field | due_date                       |
    | Processing Group Context Field | usr                            |
    | Reactor                        | CallHTTP                       |
    | Validator                      | CircIsOpen                     |
    | Event Repeatability Delay      | 00:00:30                       |
    | Max Event Validity Delay       | -300 days                      |
    | Opt-In Setting Type            | hemlock.push_notification_enabled |
    | Opt-In User Field              | usr                               |
    | Retention Interval             | 6 mons                         |
    | Template                       | [(see below)](#sample-template)          |
    | Context Bib Path               | target_copy.call_number.record |
    | Context Item Path              | target_copy                    |
    | Context Library Path           | circ_lib                       |
    | Context User Path              | usr                            |

### Sample Template

Whether cloning an existing action trigger or creating a new one, the template should be set as follows. The parameters `title`, `body`, and `type` will vary depending on the type of notification you want to send.

```
method get
url http://localhost:8842/send
  
[%- USE date -%]
[%- user = target.0.usr -%]
[%- homelib = user.home_ou -%]
  
<Parameters>
  title Courtesy Notice
  body You have a item due

  # the push notification type (optional)
  # controls the app screen that launches when you tap the notification. 
  # fines, general, holds, pmc, checkouts
  type checkouts

  # if the patron is not a mobile app user, token will be empty;
  # this does no harm and allows hemlock-sendmsg to keep a metric of all send attempts
  token [%- helpers.get_user_setting(user.id, 'hemlock.push_notification_data') %]

  # username is used by the app if there are multiple accounts on the device;
  # barcode might be better but the app does not currently store that
  username [%- user.usrname %]

  # debug=1 causes hemlock-sendmsg to log requests on stdout
  debug 1
</Parameters>
```
* Click `Save`
