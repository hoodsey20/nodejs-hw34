const db = require('../db/users');

const get = (req, res) => {
  res.render('pages/login', { msglogin: req.flash('msglogin') });
};

const post = (req, res) => {
  try {
    const { email, password } = req.body;
    db.get('users')
      .push({ email, password })
      .write();
    req.flash('msglogin', `Привет, ${email}! Вы успешно залогинились.`);
    res.redirect(301, '/login');
  } catch (error) {
    req.flash('msglogin', 'Произошла ошибка, попробуйте позже');
    res.redirect(301, '/login');
  }
};

module.exports = {
  get,
  post,
};
