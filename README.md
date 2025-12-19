Tamam 😊 Aşağıya **tek parça**, kopyalayıp **direkt `README.md` içine yapıştırabileceğin** hazır metni bırakıyorum.
Sadece **Name** ve **Student ID** kısımlarını değiştirmen yeterli 👇

---

````md
# Profiles App

## 👤 Your Name and Student ID
- **Name:** Ozan Duru  
- **Student ID:** 210408005

---

## ⚙️ Setup Instructions

### Requirements
- Node.js (v18 or later)
- npm or yarn
- Expo CLI
  ```bash
  npm install -g expo-cli
````

### Install Dependencies

```bash
git clone <your-repo-url>
cd profiles-app
npm install
```

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_BASE_URL=http://172.20.10.2:3000
```

---

## 🖥️ How to Run the Server

Go to the backend folder and run:

```bash
npm install
npm start
```

or:

```bash
npm run dev
```

Server will run at:

```text
http://172.20.10.2:3000
```

Make sure the server listens on all interfaces:

```js
app.listen(3000, '0.0.0.0');
```

---

## 📱 How to Run the App

In the frontend (Expo) project root:

```bash
npx expo start
```

Then scan the QR code with **Expo Go** or run on an emulator.

Make sure your phone and computer are on the **same Wi-Fi network**.

---

## 🌐 Your IP Configuration

```text
Local IP Address: 192.168.2.72
Backend Port: 3000
```

Used in `.env`:

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.2.72:3000
```

You can find your IP with:

```bash
ifconfig | grep "inet "
```

---

## 📌 Notes

* If IP changes, update `.env`.
* Restart Expo after changes:

  ```bash
  npx expo start -c
  ```

---

## ✍️ Author

Ozan DURU

```

---


```
