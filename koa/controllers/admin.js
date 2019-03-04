const fs = require('fs');
const path = require('path');
const util = require('util');
const rename = util.promisify(fs.rename);
const unlink = util.promisify(fs.unlink);

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
  try {
    const { name, price } = ctx.request.body;
    const { photo } = ctx.request.files;
    const responseErr = validation(name, price, photo);
    const { name: originFileName, size, path: filePath} = photo;

    if (responseErr.err) {
      await unlink(filePath);
      ctx.flash.set({ msgfile: 'Неверные данные товара или файл изображения'});
      ctx.status = 301;
      ctx.redirect('/admin');
      return;
    }

    let fileName = path.join(process.cwd(), 'public', 'upload', originFileName);
    const errUpload = await rename(filePath, fileName);

    if (errUpload) throw errUpload;

    const picPath = path.relative('./public', fileName);

    productsdb.get('products')
      .push({ name, price, src: picPath })
      .write();

    ctx.flash.set({ msgfile: 'Фото загружено'});
    ctx.status = 301;
    ctx.redirect('/admin');

  } catch (error) {
    ctx.flash.set({ msgfile: 'Произошла ошибка, попробуйте позже'});
    ctx.status = 301;
    ctx.redirect('/admin');
  }
};

const validation = (name, price, photo) => {
  if (photo.name === '' || photo.size === 0) {
    return { status: 'Не загружена картинка!', err: true };
  }
  if (!name) return { status: 'Не указано описание картинки!', err: true };
  if (!price) return { status: 'Не указана цена товара', err: true };

  return { status: 'Ok', err: false };
};

module.exports = {
  get,
  postSkills,
  postUpload,
};
