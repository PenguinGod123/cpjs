// Example of sending data to the server using fetch
// HEY get out you cant hack this even if you TRIED
console.log('%cFIREBASE > REALTIME DATABASE init success!', 'color: green');
const sendDataToServer = async (url, data) => {
    try {
      const response = await fetch(url, {
        method: 'POST', // HTTP method
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(data), // Convert data to JSON string
      });
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
  
      const responseData = await response.json(); // Parse response JSON
      return responseData; // Return the response data
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };
  
  // Example usage
  const serverUrl = '/api'; // Replace with your server URL

  async function readUserDataByName(name) {
    const dataToSend = {
        action: 'readUserDataByName',
        name: name
    }
    const returndata = await sendDataToServer(serverUrl, dataToSend);
    return returndata; // Return the response data
  }

  async function updateUserData(name, data) {
    const dataToSend = {
        action: 'updateUserData',
        name: name,
        data: data
    }
    sendDataToServer(serverUrl, dataToSend);
  }

  async function removeUser(name) {
    const dataToSend = {
        action: 'removeUser',
        name: name
    }
    sendDataToServer(serverUrl, dataToSend);
  }

  async function pushNewUser(name, password, email) {
    const dataToSend = {
      action: 'pushNewUser',
      data: {name: name,
      password: password,
      dateJoined: new Date(),
      email: email,
      skin: 'bluepenguin',
      mod: 'n',
      online: 'n',
      chatMessage: '',
      location: { x: '', y: '' },
      inventory: {
        coins: 500,
        skins: ['bluepenguin'],
      }
    }
  }
  sendDataToServer(serverUrl, dataToSend);
}

window.updateUserData = updateUserData;
window.removeUser = removeUser;
window.pushNewUser = pushNewUser;
window.readUserDataByName = readUserDataByName;