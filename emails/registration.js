const conf = require('../conf/main')

module.exports = function(email) {
  return {
    to: email,
    from: conf.EMAIL_FROM,
    subject: 'Аккаунт создан',
    html: `
      <h1>Добро пожаловать в наш магазин</h1>
      <p>Вы успешно создали аккаунт c email - ${email}</p>
      <hr />
      <a href="${conf.BASE_URL}">Магазин курсов</a>
    `
  }
}