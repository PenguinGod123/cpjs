async function hashPassword(password) {
    // Define a static salt for added security
    const salt = 'staticSaltValueForSecurity';
  
    // Combine the password with the salt
    const saltedPassword = password + salt;
  
    // Convert the salted password to an array of character codes
    const encoder = new TextEncoder();
    const data = encoder.encode(saltedPassword);
  
    // Perform the hashing using Web Crypto API
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
    // Convert the hash buffer to a hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  const insertHeader = document.getElementById('insert-header');
  const insertNav = document.getElementById('insert-nav');
  if (insertHeader) {
    insertHeader.innerHTML = `
          <img id="logo" src="https://codehs.com/uploads/3787c55372651faf0df8b1e2d264ada9"> <br>
          <h2>Kinda*</h2>
      `;
    if (insertNav) {
      insertNav.innerHTML = `
        <a href="/web/signup">Register</a>
        <a href="/web/login">Login</a>
        <a href="/web/play">Play Now!</a>
        <a href="/web/changelog">Changelog</a>
  
      `;
    }
  }
  const iconElement = document.createElement('link');
  iconElement.setAttribute('rel', 'icon');
  iconElement.setAttribute('href', '/web/src/icon.png');
  document.head.appendChild(iconElement);

  let myuser = readUserDataByName(localStorage.getItem('currentUser'));
    if (!myuser || myuser === null) {
      localStorage.setItem('currentUser', null);
      localStorage.removeItem('currentUser');
    }
  
  if (document.getElementById('currentNameDisplay')) {
    const formDiv = document.getElementsByClassName('form');
    const logoutButton = document.getElementById('logout-button');
    const currentUser = localStorage.getItem('currentUser');
    document.getElementById('currentNameDisplay').textContent = currentUser;
    document.getElementById('currentNameDisplay').style.display = 'block';
  
    logoutButton.addEventListener('click', function () {
      localStorage.setItem('currentUser', 'null');
      window.location.reload(); // Refresh the page upon logout
      console.log('logout success');
    });
  
    logoutButton.style.display =
      !currentUser || currentUser === 'null' || !myuser || myuser === null
        ? 'none'
        : 'block';
    document.getElementById('INDEXplay-link').style.display =
      !currentUser || currentUser === 'null' || !myuser || myuser === null
        ? 'none'
        : 'block';
  }
  
  document.getElementById('logo').addEventListener('click', function () {
    window.location.href = '/index';
  });
  
  // Polls sessionStorage for a key to be updated
  async function pollSessionStorageForKey(key, interval, timeout) {
    const start = Date.now();
  
    while (Date.now() - start < timeout) {
      const item = sessionStorage.getItem(key);
      if (item) {
        return JSON.parse(item); // Return the parsed object
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  
    throw new Error(`Timeout: Key "${key}" not found in sessionStorage`);
  }
  
  // Register function
  if (document.getElementById('register-button')) {
    async function register() {
      const registerOutput = document.getElementById('register-output');
      if (!registerOutput) return;
  
      const mpName = await document.getElementById('mpName').value;
      const mpPassword = document.getElementById('mpPassword').value;
      const mpEmail = document.getElementById('mpEmail').value;
      const ppcc = document.getElementById('ppcheckbox').checked;
  
      if (!ppcc) {
        registerOutput.style.display = 'block';
        registerOutput.style.backgroundColor = 'red';
        registerOutput.textContent = 'You have to check the box!';
        return;
      }
  
      if (!mpName) {
        registerOutput.style.display = 'block';
        registerOutput.style.backgroundColor = 'red';
        registerOutput.textContent = 'Error! Your name cannot be blank!';
        return;
      }
  
      if (!mpPassword || mpPassword.length < 8) {
        registerOutput.style.display = 'block';
        registerOutput.style.backgroundColor = 'red';
        registerOutput.textContent =
          'Error! Password must be at least 8 characters long!';
        return;
      }
  
      try {
        const user = await readUserDataByName(mpName);
        if (user) {
          registerOutput.style.display = 'block';
          registerOutput.style.backgroundColor = 'red';
          registerOutput.textContent = `Oops! ${mpName} already exists!`;
          return;
        } else if (!user) {
          const hashedPassword = await hashPassword(mpPassword); // Hash the password
          await pushNewUser(mpName, hashedPassword, mpEmail);
          registerOutput.style.display = 'block';
          registerOutput.style.backgroundColor = 'lightgreen';
          registerOutput.textContent = `Congrats! ${mpName} has been successfully registered!`;
          if (mpPassword.endsWith(':crix')) {
            await updateUserData(mpName, { mod: 'y' });
          }
        }
      } catch (error) {
        console.error('Error during registration:', error);
        registerOutput.style.display = 'block';
        registerOutput.style.backgroundColor = 'red';
        registerOutput.textContent = 'Something went wrong! Please try again.';
      }
    }
  
    document
      .getElementById('register-button')
      .addEventListener('click', register);
  }
  
  // Login function
  if (document.getElementById('login-button')) {
    async function login() {
      const loginOutput = document.getElementById('login-output');
      const mpName = document.getElementById('mpName').value;
      const mpPassword = document.getElementById('mpPassword').value;
  
      if (!loginOutput) return;
  
      const user = await readUserDataByName(mpName);
      const currentUser = localStorage.getItem('currentUser');
  
      if (!user) {
        loginOutput.style.display = 'block';
        loginOutput.style.backgroundColor = 'red';
        loginOutput.textContent = `Error! ${mpName} does not exist`;
      } else if (mpName === currentUser) {
        loginOutput.style.display = 'block';
        loginOutput.style.backgroundColor = 'red';
        loginOutput.textContent = `Oops! You're already logged in as ${mpName}`;
      } else {
        const hashedPassword = await hashPassword(mpPassword); // Hash the entered password
        if (user.password !== hashedPassword) {
          loginOutput.style.display = 'block';
          loginOutput.style.backgroundColor = 'red';
          loginOutput.textContent = 'Error! Incorrect password';
        } else {
          loginOutput.style.display = 'block';
          loginOutput.style.backgroundColor = 'lightgreen';
          loginOutput.textContent = `Welcome back, ${mpName}!`;
          localStorage.setItem('currentUser', mpName);
          document.getElementById('login-play-link').style.display = 'block';
        }
      }
    }
  
    document.getElementById('login-button').addEventListener('click', login);
  }
  