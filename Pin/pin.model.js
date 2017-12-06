"use strict";

const SpError = require('../../helper/SpError')
    , baseHelper = require('../../helper/Base')
    , assertEx = baseHelper.assertEx
    , Promise = require('bluebird')
    , co = Promise.coroutine
    , assert = require('assert')
    , COMMON = require('../../constants/Common')
    , models = require('../../models')
    , _ = require('lodash')
    , log4js = require('log4js')
    , logger = log4js.getLogger('pin.model')
;

module.exports = class Pin extends require('../../components/Model') {

    // static registerListeners() {
    //     // подписаться на события других моделей
    //
    // }
    constructor() {
        super();
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

    static async create(newPin, groupArr) {
        if (!groupArr || !groupArr.length) return this.save(newPin);
        let savedPin = await this.save(newPin);
        await Promise.map(groupArr, (groupId) => {
            return models.PinGroupRelation.save({
                pinId: savedPin,
                pinGroupId: groupId,
                personId: newPin.personId
            }).catch((err) => {
                logger.error(`error on creating pin relation, pinId:${savedPin.id}, groupId: ${groupId}`, err);
            })
        });
        return savedPin;
    }

    static update(pin, update) {
        return this.save(Object.assign(pin, update));
    }

    static async delete(pin) {
        const relations = await models.PinGroupRelation.find({pinId: pin.id});
        await Promise.map(relations, (relation) => models.PinGroupRelation.del(relation).catch((e) => {
            logger.error(e)
        }));
        return this.del(pin);
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
