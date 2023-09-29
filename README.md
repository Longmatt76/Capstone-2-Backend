# YourStore 

### Description 
YourStore is a platform for seamlessly and effortlessly creating your own ecommerce store. Within minutes you can build, customize and configure your own fully functional e-commerce store complete with Stripe checkout! It's important to note that this project was built as my final capstone for Springboard's software engineering career track. It's not intended for building actual commercial e-commerce websites, but rather mock sites which use Stripe in test mode. No actual transactions occur. Sorry, you won't be getting rich here! That being said, it's an excellent platform for testing out store ideas or just creating something fun in your spare time.

### Links
Deployment_ COMING SOON! A live link will be posted here. 
[frontend code](https://github.com/Longmatt76/Capstone-2-Frontend) 
[backend code](https://github.com/Longmatt76/Capstone-2-Backend)

### User Flow
The user flow depends on what you want to achieve. You may either browse stores created by other users (or yourself) as a regular 'customer'. In this scenario you can browse products, add them to your cart and checkout just like any e-commerce store. Also you may choose to create a user account to speedup checkout and have a manageable profile but this is totally optional, authorization is not required for store users. If you would like to create a store of your own (and that's the point so please do!) you must click 'create store' and register as a store owner. This doesn't need to be your real information, make it up if you want to, it will still work! There is very light validation in those regards. I'm not gathering any data, passwords are hashed. I simply want people to try out my application. Once 'YourStore' has been created go to the 'manage store' panel. From there you will be able to customize your store's look, layout and details along with the ability to add/edit products/categories plus manage inventories and track orders.

### Tools 
YourStore is a fullstack web application.

##### Frontend Tools
The frontend was built entirely with ReactJS and styled with MaterialUI. It's a 'single page web application' made possible by ReactRouter. Other frontend tools include Formik for certain forms with validation from Yup. The calls to my API are made with Axios. JsonWebToken is used for the creation and validation of user/owner tokens.

##### Backend Tools
The backend is built entirely with Node.JS/Express and uses a postgreSQL db for data storage. The database is configured with Knex for query building. The routes follow a traditional RESTFUL API structure and they interact with custom built database models that employ basic JS classes. JsonSchema is used for route validation. Bcrypt is used for hashing sensitive information. The Stripe API is used in test mode for processing orders, Stripe webhooks are used to automatically call functions upon checkout completion that both update the db with the order information and update product quantities as well as creating users in the case that the user is unauthorized. To test the backend simply run npm test, 109/109 all green baby!

**Thank you in advance for visiting YourStore. I put a lot of time, effort and thought into this project and any interest is much appreciated, please report any bugs or errors you may encounter and I'll fix them ASAP!**
