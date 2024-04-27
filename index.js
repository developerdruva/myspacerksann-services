const express = require('express');

const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 8080

const cors = require('cors');

const MyspaceRoutes = require('./routes/myspace.routes');
const SampleDataRoutes = require('./routes/sample.data.routes');
const UserAccountRoutes = require('./routes/account.user.routes');
// const todoListRoutes = require('./routes/todolist.user.routes');

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

app.get('/', (webReq, webRes) => {
    webRes.send({
        status: 'success',
        message: 'Server running successfully.'
    })
})
app.use(MyspaceRoutes);
app.use(SampleDataRoutes);
app.use(UserAccountRoutes);

app.listen(
    PORT,
    () => {
        console.clear();
        console.log();
        console.log('------------------------------ new run -------------------------------')
        console.log(`server running on ${PORT}`)
    }
);
