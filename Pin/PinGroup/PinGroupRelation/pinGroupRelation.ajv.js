"use strict";

const PIN_GROUP_RELATIOM_PROPERTIES = {
    pinId:{type: 'integer'},
    pinGroupId: {type: 'integer'},
    personId: {type: 'string'},
    createdAt: {type: 'integer'}
};

module.exports = {
    id: "25h8.trade/PinGroupRelation",
    type: "object",
    properties: PIN_GROUP_RELATIOM_PROPERTIES,
    pk: ['pinId', 'pinGroupId'],
    required: ['pinId', 'pinGroupId', 'personId', 'createdAt']

};