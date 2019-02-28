const db = require('../db/messages');
const skillsdb = require('../db/skills');
const productsdb = require('../db/products');

const get = (req, res) => {
  const skills = skillsdb.get('skills').value();
  const additionalProducts = productsdb.get('products').value();

  res.render('pages/index', {
    msgsemail: req.flash('info'),
    skills,
    additionalProducts
  });
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
    res.redirect(301, '/');
  } catch (error) {
    req.flash('info', 'Произошла ошибка, попробуйте позже');
    res.location(301, '/');
  }
};

module.exports = {
  get,
  post,
};
