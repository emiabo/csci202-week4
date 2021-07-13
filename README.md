# CSCI 202 Assignment 4 - Transformation

> Create an webpage that transforms between two distinct perspectives or identities through the user's interaction with it. "Identity" could mean aspects of a personality, political perspectives, moods, cultural backgrounds, or anything else. "User interaction" could encompass click, hover, mouseout (leaving element), doubleclick, keypress, window resize, scroll, or anything else. Basically, your page should start in one mode, and look very different during or after user interaction. It is suggested that you make use of JQuery events and JQuery effects, though not all of these will be applicable.

Wow this got hairy fast.

- Day vs night, work vs play
- Day mode: light theme, work-themed minigame (sorting objects at a packing facility)
- Night mode: dark theme, neon-bordered screen, Space Invaders-like

## Future possibilities
- Switching between the two happens automatically every 30 sec (phases can be skipped with FFWD button)
- After being exposed to both, they start interfering with each other (gradually obscuring more of the play area)
- Experiment with making controls wonky (controlling both sides at the same time?)

- [x] [Figma prototype of project](https://www.figma.com/file/7DfntNoTMHhDOhbn1cFpGK/Daily-Grind?node-id=0%3A1)
- [x] Day minigame
- [x] Night minigame
- [x] Sound effects (thanks [Beep Yeah!](https://beepyeah.itch.io/8-bit-sfx-pack))
- [ ] Auto-switch timer
- [ ] Interference effects (game windows starting to overlap and animate OR controlling both at same time)