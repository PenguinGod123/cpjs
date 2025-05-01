# here is some useful things
  **mpc** (my player config) <br>
    - mpc.spawn(x, y); <br>
    - mpc.enableMovement(bool); <br>
  **gui** <br>
    - gui.spawn; <br>
    - gui.customElement(image, id, toWhat); <br>
  **Database** *ensure you set these functions accordingly to your Database or a mock Database* <br>
    - updateUserData(name, data); <br>
    - readUserDataByName(name); - returns data; <br>
    - pushNewUser(name, password); <br>
    - Data is stored like so: <br>
     { <br>
      "JohnDoe": { <br>
        "name": "JohnDoe", <br>
        "password": "12345678", <br>
        "location": { <br>
          "x": 100, <br>
          "y": 100, <br>
        }, <br>
        "direction": "https://example.com/up.webp", <br>
        "mod": 'n', <br>
        "inventory": [ <br>
          
         ] <br>
      }, <br>
     } <br>
