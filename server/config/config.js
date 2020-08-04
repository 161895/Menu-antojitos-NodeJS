//PUERTO
process.env.PORT = process.env.PORT || 3000;

//entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//conexion a la db 
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/antojitos';
}
// } else {
//     urlDB = 'mongodb+srv://admin:123@cluster0-aokp5.mongodb.net/cafeteria'
// }

process.env.URLDB = urlDB;

//firma de JWT
process.env.SEED = process.env.SEED || 'firma-super-secreta';

//EXPIRE TIME JWT
process.env.CAD_TOKEN = process.env.CAD_TOKEN || '3h';