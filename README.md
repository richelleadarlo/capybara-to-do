# Capybara To-Do

A cute, gamified to-do app built with React + TypeScript.

## What it does

- Lets you add, complete, and delete tasks.
- Saves your tasks in `localStorage` so they persist after refresh.
- Shows a capybara and happiness meter that react as you complete tasks.
- Unlocks a "Fresh start" reset button when all tasks are done.

## How it works (brief)

- App state is managed in `src/pages/Index.tsx`.
- Tasks are stored in an array and synced to `localStorage` (`capybara-tasks`).
- Completing a task triggers small UI animations (capybara bounce + meter pulse).

## Run locally

```sh
npm install
npm run dev
```

## Add images to this README

Use Markdown image syntax:

```md
![Capybara screenshot](./public/capybara-demo.png)
```

You can also use an external URL:

```md
![Demo](https://your-site.com/image.png)
```

## Add video to this README

GitHub README files do not reliably support fully embedded playable videos. The common approach is to link a thumbnail image to YouTube (or another host):

```md
[![Watch the demo](./public/demo-thumb.png)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)
```

If you want motion directly in README, use a GIF:

```md
![Demo GIF](./public/demo.gif)
```
