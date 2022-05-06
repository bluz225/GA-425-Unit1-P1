# GA-425-Unit1-P1
GA 425 Unit 1 Project 1 Repo

# GunShapes
-   Initial Description: Gunbound-clone with modifications (tbd)
-   Detailed Description: Two players will spawn in their own turrets and take turns firing at each other. First one to hit the other wins. Be forewarned, this game is not as simple as it appears.
---
## Wireframes:
![Wireframe-StartMenu](./wireframes/Wireframe-StartMenu.png)
![Wireframe-GamePlay](./wireframes/Wireframe-GamePlay.png)
![Wireframe-GameOver](./wireframes/Wireframe-GameOver.png)


---
## Anticipated technologies to use:
- Canvas
- JS
- Html and CSS for menu and game setup

---
## (TECHNICAL?) REQUIREMENTS:
## MVP
#### Start Menu 
-   IFU
-   pvp mode
#### Game Play 
-   show current player
-   generate and render player 1 and player 2 as chosen "turret" shapes/assets
-   implement a barrel that goes from center of the turret to the mouse
-   fires on mouse click from barrel opening
-   implement turn switching
-   generate flat landscape
-   generate a projectile when fired and show projectile motion
-   wait until projectile visual has finished before switching to next player
-   implement gravity and projectile motion
-   constant initial velocity of projectile fired
-   implement explosion (circular) radius visual and hitbox on impact
-   calculate if the hitbox overlaps with enemy player
### Game Over
-   end game once one player has been hit
-   display winner and have option to return to start menu or play again
-   implement exit to start menu button
---
## Stretch Goals

- implement win counters for each player
- implement aim hud during player turn that remembers/shows last shot angle
- implement showing current aiming angle (0-180 degrees)
- implement different turrents that can be chosen at start menu
- implement HP so its not 1hit kill
-   implement increased damage for high angled shots
- implement different cannon "types" 
-   where projectile behavior isnt based solely on gravity/projectile motion
-   different bullet behavior
- implement wind on random start time with random duration timer
-   random wind speed
-   random wind direction (left and right)
-   random wind direction: variable-360 degrees
- pve mode
-   have computer randomly shoot
-   remember where it shot and if the shot landed too short then set a hard min limit on next shot angle. If too high then set hard max limit. Self iterating until it wins.
- variable intial velocity of projectile fired based on how long the left-mouse has been held down
-   implement a hud to show 0->max 
-   implement a cannon aim with a 180 degree hud centered around the "turret" asset
-   implement trail for projectile
- implement movement of turret
- implement landscape with a hill in the middle
- implement landscape with RANDOMLY GENERATED hill(s)
- implement land destruction




