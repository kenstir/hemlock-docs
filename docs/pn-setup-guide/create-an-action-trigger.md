---
sidebar_position: 4
---
# Create an action trigger

This guide is for the Evergreen Administrator.
It will help you set up your Evergreen (EG) server for sending a push notifications with an action trigger.  It assumes that your System Administrator has already installed the `hemlock-sendmsg` daemon, and it's listening on `localhost:8842`.

The process is:
* Create a User Setting Type
* Create an Action Trigger

## Create a User Setting Type

This procedure creates a new User Setting Type for the app to store its push notification token.  This token uniquely identifies the app installation, and is required to send a push notification to a specific patron account.

As an EG admin, login to the Staff client and go to Server Administration >> User Setting Types.

Procedure:
* Click `New User Setting Type`
* Set the following form values:

    | Label               | Value                                                                              |
    | ------------------- | ---------------------------------------------------------------------------------- |
    | Datatype            | string                                                                             |
    | Description         | Data stored by the Hemlock app for patrons that have opted into push notifications |
    | Label               | Hemlock Push Notification data                                                     |
    | Name                | hemlock.push_notification_data                                                     |
    | OPAC/Patron Visible | checked                                                                            |

* Click `Save`

## Create an Action Trigger

This procedure adds an action trigger to a demo server loaded with the concerto sample data.
The action trigger uses the CallHTTP reactor to send a request to the hemlock-sendmsg daemon to send the push notification.

As an EG admin, login to the Staff client and go to Local Administration >> Notifications / Action Triggers.

Procedure:
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
    | Event Repeatability Delay      | 00:00:00                       |
    | Max Event Validity Delay       | -300 days                      |
    | Retention Interval             | 6 mons                         |
    | Template                       | (see below)                    |
    | Context Bib Path               | target_copy.call_number.record |
    | Context Item Path              | target_copy                    |
    | Context Library Path           | circ_lib                       |
    | Context User Path              | usr                            |

* Set the Template form value to

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
