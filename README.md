

# Pagina web comercial

## Tecnologías

- Frontend: React 19, Tailwind CSS, Vite, Framer Motion, React Router, React Slick, React Icons, React Player.
- Backend: Node.js, Express, PostgreSQL, JWT, bcrypt, Stripe, Resend.
- Base de datos: PostgreSQL  
- Herramientas: ESLint, Nodemon para el backend y Vite para el frontend.


## Funcionalidades

-  Autenticación de usuarios (login/registro encriptados, confirmacion mail, etc)  
-  Catálogo de productos con filtros y búsqueda  
-  Carrito de compras  
-  Simulacion de pago
-  Dashboard de administración (para gestionar productos/usuarios)  
-  Diseño responsive con TailwindCSS  

#### Correccion de bugs
fix 1.1
- no se envian correos. nodemailer se bloqueó por ser considerado spam al enviar correos mediante SMTP. cambie todo el codigo referido a nodemailer a una nueva opcion llamada resend. solucionado.
fix 1.0
- Al refrescar en una pagina aparece "not found" ya que el routing no esta configurado desde el lado del cliente. Solucionado.
- Al apretar sobre un producto en la version mobile se rompe todo el frontend. Solucionado.
