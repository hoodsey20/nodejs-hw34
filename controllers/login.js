const db = require('../db/users');
const psw = require('../libs/password');

const get = (req, res) => {
  res.render('pages/login', { msglogin: req.flash('msglogin') });
};

const post = (req, res) => {

  try {
    const { email, password } = req.body;
    const user = db.getState().user;

    if (user.login === email && psw.validPassword(user, password)) {
      req.session.isAdmin = true;
      req.flash('msglogin', `Привет, ${email}! Вы успешно залогинились.`);
      res.redirect(301, '/login');
    } else {
      req.flash('msglogin', 'Такого сочетания юзера и пароля нет в нашей базе данных');
      res.redirect(301, '/login');
    }
  } catch (error) {
    req.flash('msglogin', 'Произошла ошибка, попробуйте позже');
    res.redirect(301, '/login');
  }
};

module.exports = {
  get,
  post,
};
