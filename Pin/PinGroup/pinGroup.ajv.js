"use strict";
const COMMON = require('../../../constants/Common');


const PIN_GROUP_PROPERTIES = {
    id: {type: 'integer'},
    name: {type: 'string'},
    personId: {type: 'string'},
    type: {enum: [Object.keys(COMMON.PIN_GROUP_TYPES)]},
    mainFileId: {type: 'string'},
    createdAt: {type: 'number'},
};

module.exports = {
    id: "25h8.trade/PinGroup",
    type: "object",
    properties: PIN_GROUP_PROPERTIES,
    pk: ['id'],
    required: ['personId', 'name', 'type' ,'createdAt']

};