export const config={
    db:{
        mongo:{
            collections:{
                user:"user",
                facility:"facility"
            },
            database:{
                playo:"playo",
                connectionString:'mongodb://localhost/playo'
            }
        },
    },
    jwt:{
        expiryTime:'1d',
        secretKey:'jwtSecret'
    }
}