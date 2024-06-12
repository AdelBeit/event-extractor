# Extract your work schedule from a screenshot and create calendar events all in one press of a button

##### **Currently only works with Starbucks frontline work schedule format, if you want to use it for other companies, you'll will need a custom text transformer**

### USAGE INSTRUCTIONS

-------

Using it is as easy as uploading a screenshot of your schedule and being prompted to download the calendar events file (*.ics) that you can then import into your favorite calendar (google, outlook, etc...)

[Live Demo](https://calendarizer.adelbeit.com/)

### MOTIVATION

-------

Helping busy frontline workers organize their calendars easier.

### IMPORTANT NOTE

-------

All information including screenshots, and schedule info are processed, and handled on your personal device.  No information is shared or sent anywhere. 

Designed to work **offline**.

#### WIP FEATURES:

- ✅ Ability to upload multiple pictures at once
- ⚒ Ability to edit (heal) portions of schedule the OCR couldn't fully recognize

### TECHNICAL DECISIONS

I decided to work with vanilla js and keep tooling and third party lib/frameworks to a minimum. I wanted to provide the fastest load time possible which meant reducing the js code that's shipped to client as much as possible. 

I realize that I could use react or svelte as well as typescript, those would provide better DX and maintanability. But I recognize the scope of this project is small, there is not much room for adding new updates or having other people work on it. Plus codebase is modularized pretty well so it will be relatively easy to add a new transformer or take parts of the code for other projects and for those reasons I didn't see the need to add heavy libraries just so I could have a fancy state manager or 20 small components for a very simple app.

Although I have to acknowledge that towards the end I have faced difficulties managing the state and fixing errors and kind of wish I went with svelte or something to make it all easier, but I think it's still very manageable and once I implement the healing feature I will probably not touch this code again as it will just work always. So I stand by my decision.


### CHALLENGES & LESSONS LEARNED

#### Processing and organizing shift information from screenshot

#### Managing state with nothing but vanilla js 

#### Managing visual UI state with tailwind
