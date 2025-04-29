// You can customize the game here
scene.set('welcomeroom');
gui.spawn();
mpc.spawn(50, 60);
mpc.enableMovement(true);

setInterval(syncPlayers, 1000);

if (scene.get() === 'welcomeroom') {
    scene.addObject('toPlaza', {
        location: { x: 450, y: 500 },
        size: { width: 20, height: 20 },
        backgroundImage: '/game/src/arrow.png',
        type: 'portal',
        portalTarget: 'plaza'
    });
}