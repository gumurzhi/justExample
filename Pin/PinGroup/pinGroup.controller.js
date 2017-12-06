"use strict";

const assert = require('assert')
    , Promise = require('bluebird')
    , co = Promise.coroutine
    , SpError = require('../../../helper/SpError')
    , baseHelper = require('../../../helper/Base')
    , assertEx = baseHelper.assertEx
    , models = require('../../../models')
    , ControllerBase = require('../../../components/ControllerBase')
    , view = require('../../../view/List.js')
    , _ = require('lodash')
    , log4js = require("log4js")
    , logger = log4js.getLogger('pinGroup .controller')
;


const COMMON = require('../../../constants/Common');

module.exports = class PinGroup extends ControllerBase {

    constructor() {
        super();
    }

    async create(session, postData, queryParams) {
        assertEx(Object.keys(postData).length, 'you try to create empty group', COMMON.ERRORS.MISSING_REQUIRED);
        assertEx(!postData.id, 'you trying to create already created entity', COMMON.ERRORS.NOT_ALLOWED);
        return this.model.create(session.person.id, postData);
    }

    async update(session, postData, queryParams) {
        assertEx(Object.keys(postData).length, 'you try to create empty group', COMMON.ERRORS.MISSING_REQUIRED);
        assertEx(queryParams.pinGroupId, 'pinGroupId expected', COMMON.ERRORS.MISSING_REQUIRED);
        const pinGroup = await this.model.findByPk(queryParams.pinGroupId);
        assertEx(pinGroup.personId == session.person.id, `it's not your group`, COMMON.ERRORS.NOT_ALLOWED);
        return this.model.update(pinGroup, postData);
    }

    async get(session, postData, queryParams) {
        return this.model.find(Object.assign(queryParams, {personId: session.person.id}))
    }

    async delete(session, postData, queryParams) {
        assertEx(queryParams.pinGroupId, 'pinGroupId expected', COMMON.ERRORS.MISSING_REQUIRED);
        const pinGroup = await this.model.findByPk(queryParams.pinGroupId);
        assertEx(pinGroup.personId == session.person.id, `it's not your pinGroup`, COMMON.ERRORS.NOT_ALLOWED);
        return this.model.delete(pinGroup);
    }


};
