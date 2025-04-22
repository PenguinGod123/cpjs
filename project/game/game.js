// You can customize the game here
scene.set('welcomeroom');
gui.spawn();
mpc.spawn(50, 60);
mpc.enableMovement(true);

setInterval(syncPlayers, 1000);