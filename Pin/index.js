'use strict';


module.exports = {
    controller: [
        require('./pin.controller'),
        require('./PinGroup/pinGroup.controller')],
    model: [
        require('./pin.model'),
        require('./PinGroup/pinGroup.model'),
        require('./PinGroup/PinGroupRelation/pinGroupRelation.model')
    ],
    db: [
        require('./pin.db'),
        require('./PinGroup/pinGroup.db'),
        require('./PinGroup/PinGroupRelation/pinGroupRelation.db')
    ],
    ajv: [
        require('./pin.ajv'),
        require('./PinGroup/pinGroup.ajv'),
        require('./PinGroup/PinGroupRelation/pinGroupRelation.ajv')
    ],
    routes: require('./pin.routes')
};
