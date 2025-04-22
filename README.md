# here is some useful things
  **mpc** (my player config)
    - mpc.spawn(x, y);
    - mpc.enableMovement(bool);
  **gui**
    - gui.spawn;
    - gui.customElement(image, id, toWhat);
  **Database** *ensure you set these functions accordingly to your Database or a mock Database*
    - updateUserData(name, data);
    - readUserDataByName(name); - returns data;
    - pushNewUser(name, password);
    - Data is stored like so
     - {
      "JohnDoe": {
        "name": "JohnDoe",
        "password": "12345678",
        "location": {
          "x": 100,
          "y": 100,
        },
        "direction": "https://example.com/up.webp",
        "mod": 'n',
        "inventory": {
          
        }
      },
     }