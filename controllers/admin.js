const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

const skillsdb = require('../db/skills');
const productsdb = require('../db/products');


const get = (req, res) => {
  res.render('pages/admin', {
    msgskill: req.flash('skills'),
    msgfile: req.flash('msgfile')
  });
};

const postUpload = (req, res, next) => {

  let form = new formidable.IncomingForm();
  form.encoding = 'utf-8';
  let upload = path.join('./public', 'upload');

  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload);
  }

  form.uploadDir = path.join(process.cwd(), upload);
  form.parse(req, (err, fields, files) => {

    if (err) return next(err);


    const valid = validation(fields, files);

    if (valid.err) {
      fs.unlinkSync(files.photo.path);
      req.flash('msgfile', 'Произошла ошибка при добавлении товара, попробуйте позже');
      return res.redirect(301, '/admin');
    }

    const fileName = path.join(upload, files.photo.name);

    fs.rename(files.photo.path, fileName, function (err) {
      if (err) throw err;

      const { name, price } = fields;

      try {
        const picPath = path.relative('./public', fileName);
        productsdb.get('products')
          .push({ name, price, image: picPath })
          .write();
        req.flash('msgfile', 'Фото загружено');
        res.redirect(301, '/admin');
      } catch (error) {
        req.flash('msgfile', `Произошла ошибка при добавлении товара, попробуйте позже: ${error.message}`);
        res.redirect(301, '/admin');
      }
    });
  });
};

const validation = (fields, files) => {
  if (files.photo.name === '' || files.photo.size === 0) {
    return { status: 'Не загружена картинка!', err: true };
  }
  if (!fields.name) return { status: 'Не указано описание картинки!', err: true };
  if (!fields.price) return { status: 'Не указана цена товара', err: true };

  return { status: 'Ok', err: false };
};


const postSkills = (req, res) => {
  try {
    skillsdb.set('skills', req.body)
      .write();
    req.flash('skills', 'Данные успешно обновлены');
    res.redirect(301, '/admin');
  } catch (error) {
    req.flash('skills', 'Произошла ошибка, попробуйте позже');
    res.redirect(301, '/admin');
  }
};



module.exports = {
  get,
  postSkills,
  postUpload,
};
