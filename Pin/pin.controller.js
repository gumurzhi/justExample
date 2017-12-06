"use strict";

const assert = require('assert')
    , Promise = require('bluebird')
    , co = Promise.coroutine
    , SpError = require('../../helper/SpError')
    , baseHelper = require('../../helper/Base')
    , assertEx = baseHelper.assertEx
    , models = require('../../models')
    , ControllerBase = require('../../components/ControllerBase')
    , view = require('../../view/List.js')
    , _ = require('lodash')
    , log4js = require("log4js")
    , logger = log4js.getLogger('pin.controller')
;


const COMMON = require('../../constants/Common');

module.exports = class Pin extends ControllerBase {

    constructor() {
        super();
    }

    async create(session, postData, queryParams) {
        assertEx(!!postData.pin, 'body.pin expected', COMMON.ERRORS.MISSING_REQUIRED);
        assertEx(Object.keys(COMMON.PIN_ENTITY_TYPES).indexOf(postData.pin.entityType) != -1, `wrong entity type: ${postData.pin.entityType}`, COMMON.ERRORS.BAD_REQUEST);
        if (postData.groups && postData.groups.length) await models.PinGroup.checkGroup(session.person.id, postData.length);
        let newPin = Object.assign({}, postData.pin, {
            personId: session.person.id,
            createdAt: baseHelper.getNow()
        }, await models[COMMON.ENTITY_TYPE_MODEL[postData.pin.entityType]].fillPinInfo(postData.pin.entityId));
        delete newPin.id;
        return this.model.create(newPin, postData.groups);
    }

    async update(session, postData, queryParams) {
        assertEx(queryParams.pinId, 'pinId required', COMMON.ERRORS.MISSING_REQUIRED);
        assertEx(Object.keys(postData).length, 'you send no updates', COMMON.ERRORS.MISSING_REQUIRED);
        const pin = await this.model.findOne({id: queryParams.pinId, personId: session.personId});
        assertEx(!!pin, 'there are no such pin', COMMON.ERRORS.NOT_FOUND);
        return this.model.update(pin, postData);
    }

    async get(session, postData, queryParams) {
        let res = await view.render(this.model, queryParams, session);
        if (queryParams.populate) res.result = await this.model.populate(session, res.result, queryParams.populate);
        return res;
    }

    async delete(session, postData, queryParams) {
        assertEx(queryParams.pinId, 'pinId expected', COMMON.ERRORS.MISSING_REQUIRED);
        const pin = await this.model.findByPk(queryParams.pinId);
        assertEx(!!pin, 'no such pin', COMMON.ERRORS.NOT_FOUND);
        assertEx(pin.personId == session.person.id, `it's not your pin`, COMMON.ERRORS.ACCESS_DENIED);
        return this.model.delete(pin);
    }

    async addPinToGroup(session, postData, queryParams) {
        assertEx(queryParams.pinId, 'pinId expected', COMMON.ERRORS.MISSING_REQUIRED);
        assertEx(queryParams.pinGroupId, 'pinGroupId expected', COMMON.ERRORS.MISSING_REQUIRED);
        const pin = await this.model.findByPk(queryParams.pinId);
        assertEx(pin.personId == session.person.id, `it's not your pin`, COMMON.ERRORS.ACCESS_DENIED);
        const pinGroup = await models.PinGroup.findByPk(queryParams.pinGroupId);
        assertEx(pinGroup.personId == session.person.id, `it's not your group`, COMMON.ERRORS.ACCESS_DENIED);
        return models.PinGroupRelation.save({
            pinId: pin.id,
            pinGroupId: pinGroup.id,
            personId: session.person.id,
            createdAt: baseHelper.getNow()
        });
    }

    async deletePinFromGroup(session, postData, queryParams) {
        assertEx(queryParams.pinId, 'pinId expected', COMMON.ERRORS.MISSING_REQUIRED);
        assertEx(queryParams.pinGroupId, 'pinGroupId expected', COMMON.ERRORS.MISSING_REQUIRED);
        const pin = await this.model.findByPk(queryParams.pinId);
        assertEx(pin.personId == session.person.id, `it's not your pin`, COMMON.ERRORS.ACCESS_DENIED);
        const pinGroup = await models.PinGroup.findByPk(queryParams.pinGroupId);
        assertEx(pinGroup.personId == session.person.id, `it's not your group`, COMMON.ERRORS.ACCESS_DENIED);
        return models.PinGroupRelation.del({
            pinId: pin.id,
            pinGroupId: pinGroup.id
        })
    }

};
