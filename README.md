# Board Game Day

A website to help provide information during a board game day event.
It reads from JSON groups of locations that have certain board games there.
It then displays those games in their location sections as cards with some useful info.

The server workspace includes an express server using socket-io web sockets in order to create `Score Trackers`.

## Score Trackers

Score Trackers enable a group of people playing a game to synchronously update their score in a centralized place.
It would be a future goal of the project to have this write to some sort of Database to generate overall scores for the event.

## QR codes

There's a section commented out at the bottom of the site that allows for QR codes to be displayed.
These comments are left for easy insertability for individual use.

## ENV VARS

### Site

The site requires 2 ENV VARs to be passed:

- `VITE_PEOPLE`: JSON string array of people that populate the score trackers
- `VITE_SERVER`: string of the URL of the server


### Server

The server requires an ENV VAR of `SITE`, a string of the URL of the site for CORS.