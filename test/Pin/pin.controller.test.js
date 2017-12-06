'use strict';

//require('mocha-generators').install();

global.config = require('../../../config.js');

const assert = require('assert')
    , sinon = require('sinon')
    , COMMON = require('../../../src/constants/Common')
    , Promise = require('bluebird')
    , co = Promise.coroutine
    , log4js = require('log4js')
    , decorators = require('../../../src/helper/decorators')
    , entitiesConst = require('../../constants/index')
    , localConst = require('./pin.fixtures')
;
let models = require('../../../src/models')
    , log4JsConfig = require('../../../config/log4js.json');
log4js.configure(log4JsConfig);
const logger = log4js.getLogger('pin.controller.test');
const index = require('../../../src/app/index');
index.initSingle();


const PinController = require('../../../src/app/Pin/pin.controller');
const pinController = decorators.decorateMethodsCo(new PinController());
let sandbox;

describe('pin.controller test', () => {
    beforeEach(function () {
        sandbox = sinon.sandbox.create();

    });

    afterEach(function () {
        sandbox.restore();
    });

    it('create method test - success', (done) => {
        sandbox.stub(models.Pin, 'create').callsFake((data, groupIds) => (Promise.resolve(Object.assign({}, data, {id: 33}))));
        sandbox.stub(models.PinGroup, 'checkGroup').resolves(true);
        sandbox.stub(models.Bid, 'fillPinInfo').resolves({fillPinInfo: true});
        let body = {
            pin: {
                name: 'testPin',
                entityType: 'BID',
                entityId: 33,
            },
            groups: [1, 2]
        };
        pinController.create(entitiesConst.session, body, {})
            .then(data => {
                assert(models.Pin.create.called, 'models.Pin.create must be called');
                assert(models.PinGroup.checkGroup.called, 'models.PinGroup.checkGroup must be called');
                assert(models.Bid.fillPinInfo.called, 'models.Bid.fillPinInfo must be called');
                logger.info(data);
                done();
            })
            .catch(err => {
                logger.error(`ERROR:`, err);
            })

    });
    it('update method -  test', (done) => {
        sandbox.stub(models.Pin, 'findOne').resolves(Object.assign({}, localConst.pin, {id: 33}));
        sandbox.stub(models.Pin, 'update').callsFake((pin, update) => Promise.resolve(Object.assign(pin, update)));
        pinController.update(entitiesConst.session, {name: 'vasya'}, {pinId: 33})
            .then(data => {
                //logger.info(data);
                assert(models.Pin.findOne.called, 'models.Pin.fondOne.called must be called');
                assert(models.Pin.update.called, 'models.Pin.update.called must be called');
                assert(data.name == 'vasya', 'name has not been changed');
                done();
            })
            .catch(err => {
                logger.error(`ERROR:`, err);
            })
    });
    it('delete method - test', (done) => {
        sandbox.stub(models.Pin, 'findByPk').resolves(Object.assign({}, localConst.pin, {id: 33}));
        sandbox.stub(models.Pin, 'delete').resolves(true);
        pinController.delete(entitiesConst.session, {}, {pinId: 33})
            .then(data => {
                logger.info(data);
                assert(models.Pin.findByPk.called, 'models.Pin.findByPk.called must be called');
                assert(models.Pin.delete.called, 'models.Pin.delete.called must be called');
                done();
            })
            .catch(err => {
                logger.error(`ERROR:`, err);
            })
    });
    it('addPinToGroup test - success', (done) => {
        sandbox.stub(models.Pin, 'findByPk').resolves(Object.assign({}, localConst.pin, {id:33}));
        sandbox.stub(models.PinGroup, 'findByPk').resolves(Object.assign(localConst.group));
        sandbox.stub(models.PinGroupRelation, 'save').callsFake((data) => Promise.resolve(data));
        pinController.addPinToGroup(entitiesConst.session, {}, {pinId: 33, pinGroupId: 22})
            .then(data => {
                    logger.info(data);
                    done();
                })
             .catch(err => {
                 logger.error(`ERROR:`, err);
              })
    });
    it('deletePinFromGroup test - success', (done) => {
        sandbox.stub(models.Pin, 'findByPk').resolves(Object.assign({}, localConst.pin, {id:33}));
        sandbox.stub(models.PinGroup, 'findByPk').resolves(Object.assign(localConst.group));
        sandbox.stub(models.PinGroupRelation, 'del').resolves(true);
        pinController.deletePinFromGroup(entitiesConst.session, {}, {pinId: 33, pinGroupId: 22})
            .then(data => {
                logger.info(data);
                done();
            })
            .catch(err => {
                logger.error(`ERROR:`, err);
            })
    })
});
