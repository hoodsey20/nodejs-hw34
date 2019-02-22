const skillsdb = require('../db/skills');


const get = (req, res) => {
  res.render('pages/admin', { msgskill: req.flash('skills') });
};

const postSkills = (req, res) => {
  try {
    skillsdb.set('skills', req.body)
      .write();
    req.flash('skills', 'Ваше письмо успешно отправлено');
    res.redirect('/admin');
  } catch (error) {
    req.flash('skills', 'Произошла ошибка, попробуйте позже');
    res.redirect('/admin');
  }
};

module.exports = {
  get,
  postSkills,
};
