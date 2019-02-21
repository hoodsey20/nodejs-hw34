const db = require('../db/messages');

const get = (req, res) => {
  res.render('pages/index', { msgsemail: req.flash('info') });
};

const post = (req, res) => {
  let msg = 'Ваше письмо успешно отправлено';

  try {
    const { name, email, message } = req.body;

    db.get('messages')
      .push({ name, email, message })
      .write();

    db.update('count', n => n + 1)
      .write();

  } catch (error) {
    throw error;
  }

  req.flash('info', msg);
  res.redirect('/');
};

module.exports = {
  get,
  post,
};
