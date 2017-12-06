"use strict";

const SpError = require('../../../helper/SpError')
    , baseHelper = require('../../../helper/Base')
    , assertEx = baseHelper.assertEx
    , Promise = require('bluebird')
    , co = Promise.coroutine
    , assert = require('assert')
    , COMMON = require('../../../constants/Common')
    , models = require('../../../models')
    , _ = require('lodash')
    , log4js = require('log4js')
    , logger = log4js.getLogger('pinGroup.model')
;

module.exports = class PinGroup extends require('../../../components/Model') {

    static registerListeners() {
        // подписаться на события других моделей

    }

    static populate(userData, skuArr, populateTypes, options) {
        const contactSkuPopulators = {
            //populates
        };
        this.addPopulators(contactSkuPopulators);
        return super.populate(userData, skuArr, populateTypes, options);
    }

    static addPopulators(populators) {
        if (!this.populators) this.populators = {};

        Object.keys(populators).forEach(i => {
            this.populators[i] = populators[i].bind(this);
        });
    }

    static async create(personId, pinGroup){
        assertEx(pinGroup.name, 'pinGroup.name expected', COMMON.ERRORS.MISSING_REQUIRED);
        let mainFile;
        if(pinGroup.mainFileId) mainFile = await models.File.findByPk(pinGroup.mainFileId);
        const savedPinGroup = await this.save(Object.assign(pinGroup, {personId, createdAt: baseHelper.getNow(), type: COMMON.PIN_GROUP_TYPES.USER_DEFINED}));
        if(!mainFile) return savedPinGroup;
        await models.File.save(Object.assign(mainFile, {relatedTo: COMMON.FILE_RELATIONS.PIN_GROUP, relatedId: savedPinGroup.id}));
        return savedPinGroup;

    }

    static async delete(pinGroup){
        if(pinGroup.mainFileId) await models.File.removeFiles(pinGroup.mainFileId);
        await models.PinGroupRelation.del({pinGroupId: pinGroup.id}, null, false);
        //todo what do with children????
        return this.del(pinGroup);
    }

    static async checkGroup(personId, idArr){
        const res  = await  Promise.reduce(idArr, (result, current) => {
           return this.findByPk(current)
                .then(data => {
                        if(data.personId == personId) result.success.push(current);
                        else result.errors.push({id: current, reason: 'not your group'});
                        return result;
                    })
                 .catch(err => {
                     logger.error(`ERROR:`, err);
                     result.errors.push({id: current, reason: err});
                     return result;
                  })

        }, {success: [], errors: []});
            if(res.errors.length) throw new SpError(res.errors);
        return res;
    }

    static async update(pinGroup, update){
        if(typeof update.mainFileId !== 'undefined'){
            await models.File.linkFile(pinGroup, 'mainFile', update, COMMON.FILE_RELATIONS.PIN_GROUP);
        }
        return this.save(Object.assign(pinGroup, update));
    }


};


// function* additionalMeasureUnits(userData, skuArr) {
//     if (!Array.isArray(skuArr)) skuArr = [skuArr];
//     const skuIdArr = skuArr.map(sku => sku.id);
//     const measureUnitArr = yield models.MeasureUnit.find({skuId: 'in__' + skuIdArr.join(',')});
//     return skuIdArr.reduce((result, current) => {
//         result[current] = measureUnitArr.filter(measure => measure.skuId == current);
//         return result;
//     }, {});
//
// }
