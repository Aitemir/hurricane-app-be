var config = {
    development: {
        database: {
            user: 'random',
            password: 'random',
            server: 'DESKTOP-FKQPSG0', 
            port : 1433,
            database: 'hurr-app-test',
            options: {
                trustedConnection: true
            },
            requestTimeout: 5000
        },
        server: {
            port: 5000, 
            host: '172.16.22.128'
        }
    },
    production: {
        //
        server: {
            port: 3000, 
            host: '172.16.22.128'
        }
    }
};
module.exports = config;