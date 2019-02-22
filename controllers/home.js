const db = require('../db/messages');

const get = (req, res) => {
  res.render('pages/index', { msgsemail: req.flash('info') });
};

const post = (req, res) => {
  try {
    const { name, email, message } = req.body;
    db.get('messages')
      .push({ name, email, message })
      .write();

    db.update('count', n => n + 1)
      .write();

    req.flash('info', 'Ваше письмо успешно отправлено');
    res.redirect('/');
  } catch (error) {
    req.flash('info', 'Произошла ошибка, попробуйте позже');
    res.redirect('/');
  }
};

module.exports = {
  get,
  post,
};
