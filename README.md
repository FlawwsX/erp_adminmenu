# Admin Menu 🎉
A standalone admin menu designed in React, using MUI, for use in FiveM.

I figured I'd release this to the public for people who may want it, doesn't have any dependencies except for Onesync.

## Features
This menu comes with a fair amount of features, and we are always looking to expand it out, hence the public git.

 - Wonderful Material UI design
 - Player list showing both online and disconnected players
 - Search for players in the player list
 - Ban, kick, spectate, teleportation and modification checks are included
 - Forbidden client events check (check for conflicting events)
 - Banned client command list (check for conflicting commands)
 - NoClip similar to vMenu, just without the extra stuff, could probably expand this later.
 - A force ban option which allows you to ban offline players
 - Each ban has a ban ID which you can unban using the "Pardon Player" option
 - Vehicle spawning, using server-side natives.
 - Change weather options.
 - Waypoint and coordinate teleportation, using vector values.
 - Utility action such as vehicle repair, plate change, clear area, entity deletion and much more
 - Weapon drop disabling & no vehicle rewards.

## SQL

You can use oxmysql or MySQL async.<br>Either works here!

## Onesync
To use this, you must have Onesync Infinity enabled.<br>
It will not work as designed otherwise!

## Setup
The setup procedure is pretty simple, make sure that you have NPM, Yarn, Git and a working FiveM server enabled.

Now follow the steps below!

1. Open a Command Prompt
2. Go to your FiveM resources folder using `cd destination/for/fivem/resources`
3. Once you're in, you can use `git clone https://github.com/FlawwsX/erp_adminmenu.git` and it will download the resource for you.
4. After that, do `cd erp_adminmenu/web` and run `yarn`
5. Now you can do `yarn build` and it should build the admin menu HTML files for production.
6. Run the SQL file included, should be called `adminmenu.sql`
7. Make sure you have `set discordWebhook "REPLACEMEWITHWEBHOOK"` in the server.cfg
8. Move the permissions.cfg file to the same directory as your server.cfg
9. Add `exec permissions.cfg` to your server.cfg
10. Fill in the `permissions.cfg` file.
11. Start the resource using `ensure erp_adminmenu`
12. Start the server, join and hit F10!
13. Toggle NoClip using PAGEDOWN

## Things to note

- The anti cheat functions aren't really "anti cheat" stuff, it's just there, you're more than welcome to remove it.
- Spectating uses distance culling, probably not the most popular method of spectating, but it works.
- Healing/reviving will run a command `/revive ID`. You should set this up with something like `esx_ambulance` or so.
- For screenshot to work, I suggest using screenshot-basic or https://github.com/jaimeadf/discord-screenshot
- Make sure you setup the permissions and follow the instructions!

## Support
We offer support through GitHub issues or you can comment on the FiveM forum post.