const db = require('../../db/users');
const psw = require('../../libs/password');

const get = (ctx, next) => {
  const msglogin = ctx.flash.get();
  ctx.render('pages/login', { msglogin });
};

const post = (ctx, next) => {
  try {
    const { email, password } = ctx.request.body;
    const user = db.getState().user;

    if (user.login === email && psw.validPassword(user, password)) {
      ctx.session.isAdmin = true;
      ctx.flash.set(`Привет, ${email}! Вы успешно залогинились.`);
      ctx.status = 301;
      ctx.redirect('/login');
    } else {
      ctx.flash.set('Такого сочетания юзера и пароля нет в нашей базе данных');
      ctx.status = 301;
      ctx.redirect('/login');
    }
  } catch (error) {
    ctx.flash.set('Произошла ошибка, попробуйте позже');
    ctx.status = 301;
    ctx.redirect('/login');
  }
};

module.exports = {
  get,
  post,
};
