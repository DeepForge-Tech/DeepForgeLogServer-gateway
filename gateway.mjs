import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';
import proxy from 'express-http-proxy'

const app = express();
const PORT = process.env.PORT || 8100;
const DB_PORT =  process.env.DB_SERVICE_PORT || 5001;
const USERS_PORT = process.env.USERS_SERVICE_PORT || 5003;
const LOGS_PORT = process.env.LOGS_SERVICE_PORT || 5002;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const corsOptions ={
    origin:'http://localhost:' + PORT, 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.use('/api/auth', proxy('http://localhost:' + USERS_PORT));
app.use('/api/db', proxy('http://localhost:' + DB_PORT));
app.use('/api/logs', proxy('http://localhost:' + LOGS_PORT));

app.listen(PORT, () => {
  console.log(`Gateway is running on port ${PORT}`);
});

export default app;