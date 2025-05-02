document.body.style.backgroundSize = 'cover';
document.body.style.backgroundRepeat = 'no-repeat';
sessionStorage.setItem('scene', 'welcomeroom');

function percentToPixels(percentage, totalDimension) {
    return (percentage / 100) * totalDimension;
}

console.log(sessionStorage.getItem('scene'));
// Multiplayer Game Script
document.body.insertAdjacentHTML(
  'afterbegin',
  `<div id="rc-menu"><ul><li id="rc-menu-home">Home</li><li>Back</li></ul></div>`
);

// Multiplayer Player Controller
const mpc = {
  async spawn(x, y) {
    const userId = localStorage.getItem('currentUser');
    if (!userId) {
      console.error('User ID is not set.');
      return;
    }
    
    // Update user data to mark the player as online
    updateUserData(userId, {
      online: 'y',
      location: { x: x, y: y },
      direction: `/game/skins/bluepenguin/down.png`,
    });
    let player = document.getElementById(userId);

    if (!player) {
      // Create player element
      player = document.createElement('img');
      player.id = userId;
      player.src =
        `/game/skins/bluepenguin/down.png`;
      player.alt = userId;
      Object.assign(player.style, {
        position: 'absolute',
        height: '10%',
        width: 'auto',
        transition: '0.8s',
        top: `${y}%`,
        left: `${x}%`,
      });

      document.body.appendChild(player);
    }

    window.mp = player; // Save player element globally
    updateUserData(userId, {
      online: 'y',
      location: { x: x, y: y },
      direction: `/game/skins/bluepenguin/down.png`,
    });
    console.log('Player spawned:', userId);
  },

  enableMovement(enable) {
    if (!window.mp) {
      console.error("Player element ('mp') not initialized.");
      return;
    }

    if (!enable) {
      console.log('Movement disabled.');
      return;
    }

    const speed = 200; // pixels per second

    // Enable click-based movement
    document.addEventListener('mousedown', event => {
      const userId = localStorage.getItem('currentUser');
      if (!userId) return;

      const { clientX, clientY } = event;

      // Define the bottom middle region
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const minX = screenWidth * 0.15; // 20% width from left
      const maxX = screenWidth * 0.85; // 80% width from left
      const minY = screenHeight * 0.55; // Bottom 20% of screen

      if (clientX >= minX && clientX <= maxX && clientY >= minY) {
        const player = document.getElementById(userId);

        const rect = player.getBoundingClientRect();
        const currentX = rect.left + rect.width / 2;
        const currentY = rect.top + rect.height / 2;

        const distance = Math.sqrt(
          Math.pow(clientX - currentX, 2) + Math.pow(clientY - currentY, 2)
        );

        const duration = distance / speed; // time = distance / speed

        // Update the transition duration dynamically
        player.style.transitionDuration = `${duration}s`;

        // Move the player
        player.style.left = `${clientX}px`;
        player.style.top = `${clientY}px`;

        updateUserData(userId, { location: { x: clientX, y: clientY } });
        console.log(`Position updated: (${clientX}, ${clientY})`);
      } else {
        console.log('Click ignored: Not in the designated movement area.');
      }
    });

    console.log('Click-based movement enabled.');
  },
};

window.mpc = mpc;

// Update player direction based on mouse movement
document.addEventListener('mousemove', event => {
  const userId = localStorage.getItem('currentUser');
  if (!userId) return;

  const player = document.getElementById(userId);
  if (!player) return;

  const { clientX, clientY } = event;
  const { left, right, top, bottom } = player.getBoundingClientRect();

  readUserDataByName(localStorage.getItem('currentUser')).then(data => {
    const skin = data.skin || 'bluepenguin'; // Default skin if not set
    const directionMap = {
      left: `/game/skins/${skin}/left.png`,
      right: `/game/skins/${skin}/right.png`,
      up: `/game/skins/${skin}/up.png`,
      down: `/game/skins/${skin}/down.png`,
    };
    let directionImage;
    if (clientX < left && Math.abs(clientX - left) > Math.abs(clientY - top)) {
      directionImage = directionMap.left;
    } else if (clientX > right && Math.abs(clientX - right) > Math.abs(clientY - bottom)) {
      directionImage = directionMap.right;
    } else if (clientY < top) {
      directionImage = directionMap.up;
    } else if (clientY > bottom) {
      directionImage = directionMap.down;
    }
  
    if (directionImage) {
      updateUserData(userId, { direction: directionImage });
    } else {
      console.warn('no direction image found');
    }
  });
  updateUserData(userId, {scene: scene.get()});
});

// Synchronize player data
async function syncPlayers() {
  await readUserDataByName('').then(allusers => {
    console.log('Fetched raw data:');
    window.allusers = allusers; // Store the data globally for debugging purposes
  });

  if (!window.allusers || typeof window.allusers !== 'object') {
    console.error('Invalid user data format:', window.allusers);
    return;
  }

  const allUsers = window.allusers;

  Object.entries(allUsers).forEach(([userId, data]) => {

    // Process online users
    if (data.online === 'y' && data.scene === scene.get()) {
      let player = document.getElementById(userId);

      if (!player) {
        console.log(`Creating new player element for: ${userId}`);
        player = document.createElement('img');
        player.id = userId;
        player.src = data.direction;
        player.alt = data.name;
        Object.assign(player.style, {
          position: 'absolute',
          height: '65px',
          width: 'auto',
          transition: '0.8s',
        });
        document.body.appendChild(player);
      } else {
        console.log(`Updating player position for: ${userId}`);
        player.style.zIndex = 0;
        if (data.location && data.location.x != null && data.location.y != null) {
          player.style.left = `${data.location.x}px`;
          player.style.top = `${data.location.y}px`;
          if (player.src !== data.direction) {
            player.src = data.direction;
          }
        } else {
          console.warn(`Invalid location data for user: ${userId}`);
        }
      }
    } else if (data.online === 'n' || (data.scene && data.scene !== scene.get())) {
      const offlinePlayer = document.getElementById(userId);
      if (offlinePlayer) {
        console.log(`Removing player element for offline user: ${userId}`);
        offlinePlayer.remove();
      }
    }
  });
}

window.syncPlayers = syncPlayers;

// GUI Management
const gui = {
  spawn() {
    if (!document.getElementById('guiDiv')) {
      const guiDiv = document.createElement('div');
      guiDiv.id = 'guiDiv';
      guiDiv.innerHTML = `
        <div class="toolbar">
          <img id="icon-message" src="https://codehs.com/uploads/67a6a3cf13c59a5fa136f75e6adfcb15">
          <textarea id="message-box" placeholder="Message"></textarea>
          <button id="icon-menu" style="margin: 5px;">|||</button>
        </div>
        <img id="icon-newspaper" src="https://codehs.com/uploads/77ed46772e04df270223da5be5c5ebef">
        <iframe id="gui-newspaper" src="/game/gui/newspaper/pages/main.html" style="display:none;"></iframe>
        <iframe id="gui-menu" src="/game/gui/menu/pages/main.html" style="display:none;"></iframe>
      `;
      document.body.appendChild(guiDiv);
    }
  },
};

window.gui = gui;

// Scene Management
const scene = {
  clearObjects() {
    const objects = document.querySelectorAll('.scene-object');
    objects.forEach(object => {
      object.remove();
    });
  },

  get() {
    return sessionStorage.getItem('scene');
  },

  addObject(id, data) {
    const object = document.createElement('div');
    object.id = `scene-object:${id}`;
    object.className = 'scene-object';
    object.style.position = 'absolute';
    object.style.top = `${percentToPixels(data.location.y, window.innerHeight)}px`;
    object.style.left = `${percentToPixels(window.innerWidth, data.location.x)}px`;
    object.style.width = `${data.size.width}%`;
    object.style.height = `${data.size.height}%`;
    object.style.backgroundImage = `url(${data.backgroundImage})`;
    document.body.appendChild(object);
    if (object.type === 'portal') {
      object.addEventListener('click', () => {
        const targetScene = data.portalTarget;
        scene.set(targetScene);
      });
    }
  },

  set(scene) {
    document.body.style.backgroundImage = `url(/game/markup/${scene}.webp)`;

    sessionStorage.setItem('scene', scene);

    scene.clearObjects();
    if (scene.get() === 'welcomeroom') {
      scene.addObject('toPlaza', {
          location: { x: 450, y: 500 },
          size: { width: 20, height: 20 },
          backgroundImage: '/game/src/arrow.png',
          type: 'portal',
          portalTarget: 'plaza'
      });
    }
  }
};

window.scene = scene;

// Event Listeners
let hasJoinedGame = false; // Flag to track if the player has joined the game

document.addEventListener('DOMContentLoaded', () => {
  hasJoinedGame = true; // Set the flag when the game is fully loaded
  // Custom right-click menu
  document.addEventListener('contextmenu', event => {
    event.preventDefault();
    const rcMenu = document.getElementById('rc-menu');
    rcMenu.style.top = `${Math.min(
      event.clientY,
      window.innerHeight - rcMenu.offsetHeight
    )}px`;
    rcMenu.style.left = `${Math.min(
      event.clientX,
      window.innerWidth - rcMenu.offsetWidth
    )}px`;
    rcMenu.style.display = 'block';
  });

  document.addEventListener('click', () => {
    document.getElementById('rc-menu').style.display = 'none';
  });

  document.addEventListener('click', event => {
    if (event.target.id === 'icon-newspaper') {
      const guiNewspaper = document.getElementById('gui-newspaper');
      guiNewspaper.style.display =
        guiNewspaper.style.display === 'none' ? 'block' : 'none';
    }

    if (event.target.id === 'icon-menu') {
      const guiMenu = document.getElementById('gui-menu');
      guiMenu.style.display = guiMenu.style.display === 'none' ? 'block' : 'none';
    }

    if (event.target.id === 'icon-message') {
      sendMessage(document.getElementById('message-box').value);
    }

    if (event.target.id === 'rc-menu-home') {
      window.parent.location.href = '/index';
    }
  });

  // Clean up player data on page exit
  setTimeout(() => {
    window.addEventListener('beforeunload', event => {
      if (hasJoinedGame) { // Only update the status if the player has joined
        const userId = localStorage.getItem('currentUser');
        readUserDataByName(userId).then(data => {
          if (data.online === 'y') {
            updateUserData(userId, { online: 'n' });
          }
        });
      }
  
      event.preventDefault();
      event.returnValue = '';
    });
  }, 1000);
});
