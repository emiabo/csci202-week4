# [CSCI 202 Assignment 4 - Transformation](https://emiabo.github.io/csci202-week4)

> Create an webpage that transforms between two distinct perspectives or identities through the user's interaction with it. "Identity" could mean aspects of a personality, political perspectives, moods, cultural backgrounds, or anything else. "User interaction" could encompass click, hover, mouseout (leaving element), doubleclick, keypress, window resize, scroll, or anything else. Basically, your page should start in one mode, and look very different during or after user interaction. It is suggested that you make use of JQuery events and JQuery effects, though not all of these will be applicable.

Wow this got hairy fast.

- Day vs night, work vs play
- Day mode: light theme, work-themed minigame (sorting objects at a packing facility)
- Night mode: dark theme, neon-bordered screen, Space Invaders-like

## How to play
- **Day (SortCo):** drag each shape into the box with the matching picture. +$0.50 for a correct sort, -$1.00 for the wrong box, and a $5 bonus for every 10 in a row.
- **Night:** move with ↑/↓ (or W/S) and press any other key to fire. With a mouse or touch screen, drag to steer and tap to fire. Hits are +500 and misses are -500. Enemies start shooting back once you've got the hang of it.
- Each shift lasts 30 seconds once you start playing. The **>>** button fast-forwards to the next one.
- From day 2 on, each world starts to bleed into the other. By day 3, glitches start to mess with your controls.

## Future possibilities
- Switching between the two happens automatically every 30 sec (phases can be skipped with FFWD button)
- After being exposed to both, they start interfering with each other (gradually obscuring more of the play area)
- Experiment with making controls wonky (controlling both sides at the same time?)

- [x] [Figma prototype of project](https://www.figma.com/file/7DfntNoTMHhDOhbn1cFpGK/Daily-Grind?node-id=0%3A1)
- [x] Day minigame
- [x] Night minigame
- [x] Sound effects (thanks [Beep Yeah!](https://beepyeah.itch.io/8-bit-sfx-pack))
- [x] Auto-switch timer
- [x] Interference effects (game windows starting to overlap and animate OR controlling both at same time)

#### Thanks to @tholman for the [GitHub Corners](https://github.com/tholman/github-corners) link!