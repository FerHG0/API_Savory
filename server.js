const app = require('./app/app')
const config = require('./app/config/config')

app.listen(config.PORT,()=> {
    console.log(`Aplicacin corriendo en el puerto ${config.PORT}`);
});

