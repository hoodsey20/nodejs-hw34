const db = require('../../db/messages');
const skillsdb = require('../../db/skills');
const productsdb = require('../../db/products');
const nodemailer = require('nodemailer');
const config = require('../../config.json');

const get = (ctx, next) => {
  const skills = skillsdb.get('skills').value();
  const additionalProducts = productsdb.get('products').value();
  const msgsemail = ctx.flash.get();

  ctx.render('pages/index', {
    msgsemail,
    skills,
    additionalProducts
  });
};

const post = async (ctx, next) => {
  try {
    const { name, email, message } = ctx.request.body;

    db.get('messages')
      .push({ name, email, message })
      .write();

    db.update('count', n => n + 1)
      .write();

    const transporter = nodemailer.createTransport(config.mail.smtp);
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: config.mail.smtp.auth.user,
      subject: config.mail.subject,
      text:
        message.trim().slice(0, 500) +
        `\n Отправлено с: <${email}>`
    };

    await transporter.sendMail(mailOptions);

    ctx.flash.set('Ваше письмо успешно отправлено');
    ctx.status = 301;
    ctx.redirect('/');
  } catch (error) {
    ctx.flash.set('Произошла ошибка, попробуйте позже');

    ctx.status = 301;
    ctx.redirect('/');
  }
};

module.exports = {
  get,
  post,
};
