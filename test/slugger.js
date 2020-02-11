const mongoose = require('mongoose');
const limax = require('limax');

const slugGenerator = require('..');

describe('Custom Slug library', () => {
  describe('Limax library', () => {
    const schema = new mongoose.Schema({
      title: { type: String },
      subtitle: { type: String },
      slug: { type: String, slug: 'title' },
    });
    schema.plugin(slugGenerator, { slugger: limax });
    const LimaxModel = mongoose.model('LimaxModel', schema);

    before(async () => LimaxModel.remove({}));
    after(async () => LimaxModel.remove({}));

    it('simple', async () => {
      const doc = await LimaxModel.create({
        title: 'Chapter 1',
      });
      doc.should.have.property('slug').and.equal('chapter-1');
    });

    it('special characters', async () => {
      const doc = await LimaxModel.create({
        title: 'I hate this "#^(@ special characters. Remove|replace&don\'t show me',
      });
      doc.should.have
        .property('slug')
        .and.equal('i-hate-this-special-characters-remove-or-replace-and-dont-show-me');
    });

    it('emoticon characters', async () => {
      const doc = await LimaxModel.create({
        title: 'i ♥ latin',
      });
      doc.should.have.property('slug').and.equal('i-love-latin');
    });

    it('chinese characters', async () => {
      const doc = await LimaxModel.create({
        title: '我爱官话',
      });
      doc.should.have.property('slug').and.equal('wo3-ai4-guan1-hua4');
    });
  });

  describe('Custom library', () => {
    const schema = new mongoose.Schema({
      title: { type: String },
      subtitle: { type: String },
      slug: { type: String, slug: 'title' },
    });
    schema.plugin(slugGenerator, {
      upper: true,
      slugger: (value, options) =>
        (options && options.upper ? value.toUpperCase() : value.toLowerCase()).replace(' ', '_'),
    });
    const CustomModel = mongoose.model('CustomModel', schema);

    before(async () => CustomModel.remove({}));
    after(async () => CustomModel.remove({}));

    it('simple', async () => {
      const doc = await CustomModel.create({
        title: 'Chapter 1',
      });
      doc.should.have.property('slug').and.equal('CHAPTER_1');
    });
  });
});
