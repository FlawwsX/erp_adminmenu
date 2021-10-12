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
The setup procedure is pretty simple, simply ensure you have a working FiveM server.

1. Head to https://github.com/FlawwsX/erp_adminmenu/releases
2. Download the latest release ZIP file, e.g. `release-1.0.0.zip`
3. Open the ZIP, extract the erp_adminmenu folder to your resources folder.
5. Run the SQL file included, should be called `adminmenu.sql`
6. Make sure you have `set discordWebhook "REPLACEMEWITHWEBHOOK"` in the server.cfg
7. Move the permissions.cfg file to the same directory as your server.cfg
8. Add `exec permissions.cfg` to your server.cfg
9. Fill in the `permissions.cfg` file.
10. Start the resource using `ensure erp_adminmenu`
11. Enjoy!

## Keybinds

Upon installation, the default keybind to open the menu is F10 & PAGEDOWN to enable NoClip.
Each user can customize these keybinds by heading to settings > key bindings > fivem.

## Things to note

- The anti cheat functions aren't really "anti cheat" stuff, it's just there, you're more than welcome to remove it.
- Spectating uses distance culling, probably not the most popular method of spectating, but it works.
- Healing/reviving will run a command `/revive ID`. You should set this up with something like `esx_ambulance` or so.
- For screenshot to work, I suggest using screenshot-basic or https://github.com/jaimeadf/discord-screenshot
- Make sure you setup the permissions and follow the instructions!

## Support
We offer support through GitHub issues or you can comment on the FiveM forum post.
