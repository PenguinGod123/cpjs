# Club Penguin JavaScript - Useful Information

## **Player Configuration (mpc)**  
The `mpc` object provides methods to manage the player's configuration and movement:  
- **`mpc.spawn(x, y)`**  
  Spawns the player at the specified `x` and `y` coordinates.  
- **`mpc.enableMovement(bool)`**  
  Enables or disables player movement. Pass `true` to enable or `false` to disable.

---

## **Graphical User Interface (gui)**  
The `gui` object provides methods to manage the game's graphical user interface:  
- **`gui.spawn`**  
  Spawns the default GUI elements.  
- **`gui.customElement(image, id, toWhat)`**  
  Creates a custom GUI element with the specified `image`, `id`, and parent container (`toWhat`).

---

## **Database Functions**  
Ensure these functions are configured to work with your database or a mock database:  
- **`updateUserData(name, data)`**  
  Updates the user data for the specified `name` with the provided `data` object.  
- **`readUserDataByName(name)`**  
  Reads and returns the user data for the specified `name`.  
- **`pushNewUser(name, password)`**  
  Creates a new user with the specified `name` and `password`.

### **Example Data Structure**  
User data is stored in the following format:  
```json
{
  "JohnDoe": {
    "name": "JohnDoe",
    "password": "1234", // MAKE SURE YOU HASH THE PASSWORD!!!
    "location": {
      "x": 100,
      "y": 100
    },
    "direction": "https://example.com/up.webp",
    "mod": "n",
    "inventory": {
      "coins": 500,
      "skins": ["bluepenguin"]
    }
  }
}

