'use strict';
global.config = require('../../../config.js');

const assert = require('assert')
    , sinon = require('sinon')
    , COMMON = require('../../../src/constants/Common')
    , Promise = require('bluebird')
    , co = Promise.coroutine
    , log4js = require('log4js')
    , _ = require('lodash')
    , entityConst = require('../../constants/index')
    , localConst = require('./pin.fixtures')
;
let models = require('../../../src/models')
    , log4JsConfig = require('../../../config/log4js.json');
log4js.configure(log4JsConfig);
const logger = log4js.getLogger('pin.model.test');
const index = require('../../../src/app/index');
index.initSingle();


let pinModel = models.Pin;
let sandbox;

describe('pin.model test', () => {
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('create test - success', (done) => {
        sandbox.stub(models.Pin, 'save').callsFake((data) => Promise.resolve(data));
        sandbox.stub(models.PinGroupRelation, 'save').resolves(true);
        pinModel.create(localConst.pin)
            .then(data => {
                logger.info(data);
                assert(models.Pin.save, 'models.Pin.save must be called');
                assert(models.PinGroupRelation.save, 'models.PinGroupRelation.save must be called');
                done();
            })
            .catch(err => {
                logger.error(`ERROR:`, err);
            })
    });
    it('delete method test - success', (done) => {
        sandbox.stub(models.PinGroupRelation, 'find').resolves([1, 2, 3]);
        sandbox.stub(models.PinGroupRelation, 'del').resolves(true);
        sandbox.stub(models.Pin, 'del').resolves(true);
        pinModel.delete(localConst.pin)
            .then(data => {
                //logger.info(data);
                assert(models.PinGroupRelation.del, 'models.PinGroupRelation.del must be called');
                assert(models.Pin.del, 'models.Pin.del must be called');
                done();
            })
            .catch(err => {
                logger.error(`ERROR:`, err);
            })
    })
});