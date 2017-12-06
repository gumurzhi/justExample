"use strict";

const SpError = require('../../../../helper/SpError')
    , baseHelper = require('../../../../helper/Base')
    , assertEx = baseHelper.assertEx
    , Promise = require('bluebird')
    , co = Promise.coroutine
    , assert = require('assert')
    , COMMON = require('../../../../constants/Common')
    , models = require('../../../../models')
    , _ = require('lodash')
    , log4js = require('log4js')
    , logger = log4js.getLogger('pinGroupRelation.model')
;

module.exports = class PinGroupRelation extends require('../../../../components/Model') {
    constructor() {
        super();
    }

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

    static save(pinRelation) {
        pinRelation.createdAt = !pinRelation.createdAt ? baseHelper.getNow() : pinRelation.createdAt;
        return super.save(pinRelation);
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
