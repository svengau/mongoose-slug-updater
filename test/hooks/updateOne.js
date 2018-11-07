'use strict';

const mongoose = require('mongoose'),
  chai = require('chai'),
  should = chai.should(),
  assert = require('assert');

const {
  ShortId,
  Counter
} = require("./../models");

const tellme = require('./../tellme');

describe('updateOne', function() {
  beforeEach(async () => {
    await ShortId.remove({});
    await Counter.remove({});
  });

  afterEach(async () => {
    await ShortId.remove({});
    await Counter.remove({});
  });

  it('Update not watcher field shortId', async () => {
    let res = await ShortId.create({
      title: tellme.getText(0),
      subtitle: tellme.getText(1),
      otherField: tellme.getText(1),
    });
    let { _id, slug, uniqueSlug } = res;
    let mdf = {
      otherField: tellme.getText(1),
    };
    await ShortId.updateOne({ _id }, mdf);
    let editedDoc = await ShortId.findById(_id);

    editedDoc.should.have.property('otherField').and.equal(mdf.otherField);

    editedDoc.should.have.property('slug').and.equal(slug);

    editedDoc.should.have.property('uniqueSlug').and.equal(uniqueSlug);

    mdf = {
      otherField: tellme.getText(4),
    };
    await ShortId.updateOne({ _id }, { $set: mdf });
    editedDoc = await ShortId.findById(_id);

    editedDoc.should.have.property('otherField').and.equal(mdf.otherField);

    editedDoc.should.have.property('slug').and.equal(slug);

    editedDoc.should.have.property('uniqueSlug').and.equal(uniqueSlug);
  });

  it('Update not watcher field counter', async () => {
    let res = await Counter.create({
      title: tellme.getText(0),
      subtitle: tellme.getText(1),
      otherField: tellme.getText(1),
    });
    let { _id, slug, uniqueSlug } = res;
    let mdf = {
      otherField: tellme.getText(1),
    };
    await Counter.updateOne({ _id }, mdf);
    let editedDoc = await Counter.findById(_id);

    editedDoc.should.have.property('otherField').and.equal(mdf.otherField);

    editedDoc.should.have.property('slug').and.equal(slug);

    editedDoc.should.have.property('uniqueSlug').and.equal(uniqueSlug);

    mdf = {
      otherField: tellme.getText(4),
    };
    await Counter.updateOne({ _id }, { $set: mdf });
    editedDoc = await Counter.findById(_id);

    editedDoc.should.have.property('otherField').and.equal(mdf.otherField);

    editedDoc.should.have.property('slug').and.equal(slug);

    editedDoc.should.have.property('uniqueSlug').and.equal(uniqueSlug);
  });

  it('Update title and check if slug was updated', async () => {
    let res = await ShortId.create({
      title: tellme.getText(0),
      subtitle: tellme.getText(1),
    });
    let { _id, slug, uniqueSlug } = res;
    let mdf = {
      title: tellme.getText(2),
      // subtitle: tellme.getText(1)
    };
    // console.debug('upd_id', _id);
    await ShortId.updateOne({ _id }, mdf);
    let editedDoc = await ShortId.findById(_id);

    editedDoc.should.have
      .property('slug')
      .and.equal(
        tellme.getSlug(2,1)
      );
    editedDoc.should.have
      .property('uniqueSlug')
      .and.equal(tellme.getSlug(2));
    mdf = {
      title: tellme.getText(3),
      // subtitle: tellme.getText(1)
    };
    // console.debug('upd_id', _id);
    await ShortId.updateOne({ _id }, { $set: mdf });
    editedDoc = await ShortId.findById(_id);

    editedDoc.should.have
      .property('slug')
      .and.equal(
        tellme.getSlug(3,1)
      );
    editedDoc.should.have
      .property('uniqueSlug')
      .and.equal(tellme.getSlug(3));
  });

  it('Update subtitle and check if slug was updated', async () => {
    let res = await ShortId.create({
      title: tellme.getText(0),
      subtitle: tellme.getText(1),
    });
    // console.debug('created doc', res);
    let { _id, slug, uniqueSlug } = res;
    let mdf = {
      subtitle: tellme.getText(3),
    };
    await ShortId.updateOne({ _id }, mdf);
    let editedDoc = await ShortId.findById(_id);

    editedDoc.should.have
      .property('slug')
      .and.equal(
        tellme.getSlug(0,3)
      );
    editedDoc.should.have
      .property('uniqueSlug')
      .and.equal(tellme.getSlug(0));
    mdf = {
      subtitle: tellme.getText(4),
    };
    // console.debug('upd_id', _id);
    await ShortId.updateOne({ _id }, { $set: mdf });
    editedDoc = await ShortId.findById(_id);

    editedDoc.should.have
      .property('slug')
      .and.equal(tellme.getSlug(0,4));
    editedDoc.should.have
      .property('uniqueSlug')
      .and.equal(tellme.getSlug(0));
  });

  it("Update watcher fields to the same values and check slugs wasn't changed", async () => {
    let res = await ShortId.create({
      title: tellme.getText(0),
      subtitle: tellme.getText(1),
    });
    let { _id, slug, uniqueSlug } = res;
    let mdf = {
      title: tellme.getText(0),
      subtitle: tellme.getText(1),
    };
    // console.log("same values");
    await ShortId.updateOne({ _id }, mdf);
    let editedDoc = await ShortId.findById(_id);
    editedDoc.should.have.property('slug').and.equal(slug);
    editedDoc.should.have.property('uniqueSlug').and.equal(uniqueSlug);
    await ShortId.updateOne({ _id }, { $set: mdf });
    editedDoc = await ShortId.findById(_id);
    editedDoc.should.have.property('slug').and.equal(slug);
    editedDoc.should.have.property('uniqueSlug').and.equal(uniqueSlug);
  });

  it('UpdateOne without _id', async () => {
    let doc = await ShortId.create({
      title: tellme.getText(0),
      subtitle: tellme.getText(1),
    });
    let { _id, slug, uniqueSlug } = doc;
    let mdf = {
      title: tellme.getText(2),
      subtitle: tellme.getText(3),
    };

    await ShortId.updateOne({ uniqueSlug }, mdf);
    let editedDoc = await ShortId.findOne(_id);

    editedDoc.should.have
      .property('slug')
      .and.equal(
        tellme.getSlug(2,3)
      );
    editedDoc.should.have
      .property('uniqueSlug')
      .and.equal(tellme.getSlug(2));

    ({ _id, slug, uniqueSlug } = editedDoc);

    mdf = {
      title: tellme.getText(4),
      subtitle: tellme.getText(5),
    };

    await ShortId.updateOne({ slug }, { $set: mdf });
    editedDoc = await ShortId.findById(_id);

    editedDoc.should.have
      .property('slug')
      .and.equal(tellme.getSlug(4,5));
    editedDoc.should.have.property('uniqueSlug').and.equal(tellme.getSlug(4));
  });
});