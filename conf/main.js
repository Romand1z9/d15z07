module.exports = {
    BASE_URL: 'http://localhost:3000',
    SESSION_SECRET: 'some secret value',
    getUrlConnect: function() {
        const user = 'userTwo'
        const password = 'dsadsadsad'
        return `mongodb+srv://${user}:${password}@cluster0.dekys.mongodb.net/shop`
    },
    EMAIL_FROM: ''
}