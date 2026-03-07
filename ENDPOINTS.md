# CarTinder API Endpoints

| Method | Route | Description | Role |
| :--- | :--- | :--- | :--- |
| **Auth** | | | |
| POST | `/api/auth/register` | Register a new user | All |
| POST | `/api/auth/login` | Login and receive JWT token | All |
| **User** | | | |
| GET | `/api/users/profile` | Get current user profile | User/Dealer |
| PUT | `/api/users/profile` | Update current user profile | User/Dealer |
| GET | `/api/users` | Get all users (Debug/Admin) | All |
| **Cars** | | | |
| GET | `/api/cars` | Fetch all available cars with filters | User/Dealer |
| GET | `/api/cars/dealer` | Fetch cars listed by the current dealer | Dealer |
| POST | `/api/cars` | List a new car for rental | Dealer |
| PUT | `/api/cars/:id` | Update car details or status | Dealer |
| DELETE | `/api/cars/:id` | Remove a car listing | Dealer |
| **Bookings** | | | |
| POST | `/api/bookings` | Create a new booking request | User |
| GET | `/api/bookings/my` | Get all bookings made by current user | User |
| GET | `/api/bookings/dealer` | Get all booking requests for dealer's cars | Dealer |
| PUT | `/api/bookings/:id/status` | Update booking status (confirm/cancel) | User/Dealer |
| **Chats** | | | |
| GET | `/api/chats` | Get all conversations for current user | User/Dealer |
| GET | `/api/chats/:chatId/messages` | Get message history for a chat | User/Dealer |
| POST | `/api/chats/message` | Send a new message | User/Dealer |
| POST | `/api/chats/start` | Start or get a chat with another user | User/Dealer |
| **Reviews** | | | |
| POST | `/api/reviews` | Create a review for a car/trip | User |
| GET | `/api/reviews/car/:carId` | Get all reviews for a specific car | All |
| **Swipes** | | | |
| POST | `/api/swipes` | Record a swipe (like/pass/superlike) | User |
| GET | `/api/swipes/likes` | Get all cars liked by the user | User |
| **Notifications** | | | |
| GET | `/api/notifications` | Get recent notifications | User/Dealer |
| PUT | `/api/notifications/:id/read` | Mark a notification as read | User/Dealer |
| PUT | `/api/notifications/read-all` | Mark all notifications as read | User/Dealer |
