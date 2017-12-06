"use strict";
const COMMON = require('../../constants/Common');


const PIN_PROPERTIES = {
    id: {type: 'integer'},
    entityType: {ENUM: [COMMON.ENTITY_TYPE.BID, COMMON.ENTITY_TYPE.BIDDING]},
    entityId: {type: 'number'},
    personId: {type: "string"},
    name: {type: 'string'},
    description: {type: 'string'},
    mainFileId: {type: 'string'},
    createdAt: {type: 'number'},
    customData: {type: 'object'}
};

module.exports = {
    id: "25h8.trade/Pin",
    type: "object",
    properties: PIN_PROPERTIES,
    // json: {'elementGallery': "Array", "filesAttachList": "Array", constMeasureUnitIds: "Array"},
    pk: ['id'],
    required: ['entityType', 'entityId', 'personId', 'createdAt']

};