# Piki Ora Medical Centre - React Frontend

ISCG7420 Web Application Development - Assignment 2, Task 2 (frontend)

Student: Adithyan Suji (Student ID: 1589957)

- Frontend: https://pikiora-frontend.onrender.com
- Django REST Framework API repository: https://github.com/12adisuji05/ISCG7420-Assignment2-DRF

## Structure

- `src/components` - patient pages (doctors, booking, my appointments, login, register)
- `src/components/admin` - administrator dashboard (doctors, slots, appointments, patient accounts)
- `src/api.js` - axios instance that sends the login token
- `src/AuthContext.jsx` - shares the logged-in user (Context API)

## Run on your computer

Start the Django API first (see the API repository), then:

```
npm install
npm run dev
```

Open http://localhost:5173. The API address comes from `VITE_API_URL` (default `http://127.0.0.1:8000/api/`).

## Deploy to Render

On Render: New > Blueprint > choose this repository. `render.yaml` builds the app and publishes the `dist` folder as a static site.

## References

- axios. (n.d.). *Getting started*. https://axios-http.com/docs/intro
- Bootstrap. (n.d.). *Bootstrap 5.3 documentation*. https://getbootstrap.com/docs/5.3/
- Bootstrap. (n.d.). *Bootstrap Icons* (Version 1.11). https://icons.getbootstrap.com/
- Google Fonts. (n.d.). *Nunito*. https://fonts.google.com/specimen/Nunito
- Meta Open Source. (n.d.). *React documentation*. https://react.dev/
- Remix Software. (n.d.). *React Router* (Version 6). https://reactrouter.com/6.28.0
- Render. (n.d.). *Deploy a Vite app on Render*. https://render.com/docs/deploy-vite
- Vite. (n.d.). *Getting started*. https://vite.dev/guide/
