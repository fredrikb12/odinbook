# Odinbook

The server side code for a social media application.

Final project of the NodeJS path in [The Odin Project](https://www.theodinproject.com).

You may find project specifications and other details on the [project page](https://www.theodinproject.com/lessons/nodejs-odin-book).

## Demo

![Desktop demo gif](../media/odinbook-demo.gif?raw=true) ![Mobile demo gif](../media/odinbook-mobile-demo.gif?raw=true)

## Features

- Friend requests that can be accepted, denied, or cancelled.
- Posts that can be liked, commented on, and deleted.
- User page that lists all user accounts.

## Live demo

Go to the deployed project at [odinbook.xyz](https://odinbook.xyz) to try it out!

Client repository available [here](https://github.com/fredrikb12/odinbook-client).

## Possible improvements

### UI / UX

- Create specific component that shows current friend requests.
- Add loading animations to not suggest the app is bugged.
- Improve post's comment section design.

### Code

- Refactor more logic to be separate from React components.
- Change way of handling authentication?

### Features

- Direct messaging with the socket.io library.
- Live notifications for new friend requests.

## Reflections

As this is the final project of the whole Node path, it's very large in scale. You are to build a front-end that communicates with an API (that you've built), displays the data fetched, and ideally does this in a very streamlined way allowing for a comfortable user experience.

I felt relatively comfortable writing the code for the back-end this time, as much of it is repetition from previous projects; making posts and comments in the Blog project, handling authentication in the Members Only project, etc. That being said, the data model relationships were significantly more complicated this time around, which required a lot of work to handle.

The front-end development process went relatively smoothly, and I appreciate the back and forth you can get into when your project reaches that point. You try to implement a feature on the front-end, realize something has to change in the back-end, implement that change in the code and it all comes together very nicely. It's a great iterative process, and I enjoy that a lot.

I was originally intending to look into both socket.io for direct messaging, and reading into how one might implement video calls, however the overall scope and complexity of the project was already large enough, by the time I finished the core functionality I felt happy with the result. Something worth keeping in mind for the future!

## Contact

Foole#9692 on Discord

## Developer Portfolio

[fredrikb12.dev](https://fredrikb12.dev)
