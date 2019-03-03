const fs = require('fs');
const path = require('path');

const skillsdb = require('../../db/skills');
const productsdb = require('../../db/products');

const get = (ctx, next) => {
  const msg = ctx.flash.get();

  const msgskill = msg && msg.msgskill || null;
  const msgfile = msg && msg.msgfile || null;

  ctx.render('pages/admin', {
    msgskill,
    msgfile,
  });
};

const postSkills = (ctx, next) => {
  try {
    const { age, concerts, cities, years } = ctx.request.body;
    const data = [
      {
        'number': age,
        'text': 'Возраст начала занятий на скрипке'
      },
      {
        'number': concerts,
        'text': 'Концертов отыграл'
      },
      {
        'number': cities,
        'text': 'Максимальное число городов в туре'
      },
      {
        'number': years,
        'text': 'Лет на сцене в качестве скрипача'
      }
    ];

    skillsdb.set('skills', data)
      .write();
    ctx.flash.set({ msgskill: 'Данные успешно обновлены'});

    ctx.status = 301;
    ctx.redirect('/admin');
  } catch (error) {
    ctx.flash.set({ msgskill: 'Произошла ошибка, попробуйте позже'});
    ctx.status = 301;
    ctx.redirect('/admin');
  }
};

const postUpload = async (ctx, next) => {
  const responseErr = validation(ctx.request.body, ctx.request.files);
  const { name, price } = ctx.request.body;
  const { name: fileName, size, path: filePath } = ctx.request.files.file;

  if (responseErr) {
    await unlink(filePath);
    console.log('responseErr', responseErr);
  } else {
    console.log('no error');
  }
  // TODO: реализовать загрузку товара
};

const validation = (fields, files) => {
  if (files.photo.name === '' || files.photo.size === 0) {
    return { status: 'Не загружена картинка!', err: true };
  }
  if (!fields.name) return { status: 'Не указано описание картинки!', err: true };
  if (!fields.price) return { status: 'Не указана цена товара', err: true };

  return { status: 'Ok', err: false };
};

module.exports = {
  get,
  postSkills,
  postUpload,
};
