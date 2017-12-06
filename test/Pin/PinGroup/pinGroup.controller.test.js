'use strict';

//require('mocha-generators').install();

global.config = require('../../../../config.js');

const assert = require('assert')
    , sinon = require('sinon')
    , COMMON = require('../../../../src/constants/Common')
    , Promise = require('bluebird')
    , co = Promise.coroutine
    , log4js = require('log4js')
    , decorators = require('../../../../src/helper/decorators')
    , entitiesConst = require('../../../constants/index')
    , localConst = require('./../pin.fixtures')
;
let models = require('../../../../src/models')
    , log4JsConfig = require('../../../../config/log4js.json');
log4js.configure(log4JsConfig);
const logger = log4js.getLogger('pinGroup.controller.test');
const index = require('../../../../src/app/index');
index.initSingle();


const PinController = require('../../../../src/app/Pin/PinGroup/pinGroup.controller');
const pinGroupController = decorators.decorateMethodsCo(new PinController());
let sandbox;

describe('pinGroup.controller test', () => {
    beforeEach(function () {
        sandbox = sinon.sandbox.create();

    });

    afterEach(function () {
        sandbox.restore();
    });

    it('create method test - success', (done) => {
        sandbox.stub(models.PinGroup, 'create').callsFake((personId, pinGroup) => (Promise.resolve(Object.assign({}, pinGroup, {
            id: 33,
            personId
        }))));
        let body = {
            name: 'myGroup'
        };
        pinGroupController.create(entitiesConst.session, body, {})
            .then(data => {
                assert(models.PinGroup.create.called, 'models.PinGroup.create must be called');
                logger.info(data);
                done();
            })
            .catch(err => {
                logger.error(`ERROR:`, err);
            })

    });
    it('update method test - success', (done) => {
        sandbox.stub(models.PinGroup, 'findByPk').resolves(localConst.group);
        sandbox.stub(models.PinGroup, 'update').callsFake((pinGroup, update) => Promise.resolve(Object.assign(pinGroup, update)));
        pinGroupController.update(entitiesConst.session, {name: 'vasya'}, {pinGroupId: 33})
            .then(data => {
                logger.info(data);
                done();
            })
            .catch(err => {
                logger.error(`ERROR:`, err);
            })
    });
    it('delete method test - success', (done) => {
        sandbox.stub(models.PinGroup, 'findByPk').resolves(localConst.group);
        sandbox.stub(models.PinGroup, 'delete').resolves(true);
        pinGroupController.delete(entitiesConst.session, {}, {pinGroupId: 33})
            .then(data => {
                    logger.info(data);
                    done();
                })
             .catch(err => {
                 logger.error(`ERROR:`, err);
              })
    });

});
