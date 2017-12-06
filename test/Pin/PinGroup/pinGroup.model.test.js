'use strict';

global.config = require('../../../../config.js');

const assert = require('assert')
    , sinon = require('sinon')
    , COMMON = require('../../../../src/constants/Common')
    , Promise = require('bluebird')
    , co = Promise.coroutine
    , log4js = require('log4js')
    , decorators = require('../../../../src/helper/decorators')
    , entityConst = require('../../../constants/index')
    , localConst = require('./../pin.fixtures')
;
let models = require('../../../../src/models')
    , log4JsConfig = require('../../../../config/log4js.json');
log4js.configure(log4JsConfig);
const logger = log4js.getLogger('pinGroup.model.test');
const index = require('../../../../src/app/index');
index.initSingle();

let pinGroupModel = models.PinGroup; //require('../../../../src/app/Sku/SkuCatalog/skuCatalog.model')
let sandbox;

describe('pinGroup.model test', () => {
    beforeEach(function () {
        sandbox = sinon.sandbox.create();

    });

    afterEach(function () {
        sandbox.restore();
    });
    it('checkGroup test - get err', (done) => {
        sandbox.stub(models.PinGroup, 'findByPk').rejects(new Error('soneError'));
        pinGroupModel.checkGroup('personId', [1, 2, 3])
            .then(data => {

            })
            .catch(err => {
       //         logger.error(`ERROR:`, err);
                assert(err.message.length == 3, 'err.message must be array of errors');
                done();
            });
    });

    it('checkGroup test - get 1 err', (done) => {
        sandbox.stub(models.PinGroup, 'findByPk').withArgs(1).resolves({personId: 'personId'}).withArgs(2).resolves({personId: 'personId'}).withArgs(3).resolves({personId: 'person'});
        pinGroupModel.checkGroup('personId', [1, 2, 3])
            .then(data => {

            })
            .catch(err => {
      //          logger.error(`ERROR:`, err);
                assert(err.message.length == 1, 'err.message must be array of errors');
                done();
            });
    });


    it('checkGroup test - get success', (done) => {
        sandbox.stub(models.PinGroup, 'findByPk').resolves({personId: 'personId'});
        pinGroupModel.checkGroup('personId', [1, 2, 3])
            .then(data => {
                logger.info(data);
                assert(!!data);
                done();
            })
            .catch(err => {
                logger.error(`ERROR:`, err);
            });
    });

    it('create method test, no mainFile - success', (done) => {
        sandbox.stub(models.File, 'findByPk').resolves({id: 'fdfdlfkjd'});
        sandbox.stub(models.PinGroup, 'save').callsFake((data) => Promise.resolve(data));
        sandbox.stub(models.File, 'save').resolves(true);
        pinGroupModel.create('personId', {name: 'abc'})
            .then(data => {
                //logger.info(data);
                assert(data.personId == 'personId', 'wrong personId');
                assert(data.type == COMMON.PIN_GROUP_TYPES.USER_DEFINED, 'wrong type');
                done();
            })
            .catch(err => {
                logger.error(`ERROR:`, err);
            })
    });

    it('delete method test', (done) => {
        sandbox.stub(models.File, 'removeFiles').resolves(true);
        sandbox.stub(models.PinGroupRelation, 'del').callsFake((params, userData, skipFlag) => {
            assert(typeof skipFlag != 'undefined', 'check must be skipped');
            return Promise.resolve([true]);
        });
        sandbox.stub(models.PinGroup, 'del').resolves(true);
        pinGroupModel.delete(Object.assign({}, localConst.group, {mainFileId: 'blabla'}))
            .then(data => {
                //   logger.info(data);
                assert(models.File.removeFiles.called, 'models.File.removeFiles must be called');
                assert(models.PinGroupRelation.del.called, 'models.PinGroupRelation.del must be called');
                assert(models.PinGroup.del.called, 'models.PinGroup.del must be called');
                done();
            })
            .catch(err => {
                logger.error(`ERROR:`, err);
            })
    })

});
