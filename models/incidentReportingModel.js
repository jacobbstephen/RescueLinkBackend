const mongoose = require('mongoose');

const incidentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'User is required']
    },
    
    title: {
        required: true,
        type:String,
        trim: true,
    },
    description: {
        required: true,
        type:String,
        trim: true,

    },
    location:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },

        coordinates: {
            type: [Number],
            required: true
        },
    },

    

    // filePath: {
    //     type: String,
    //     required: [true, 'Path is required']
    // },


})


const incidentModel = mongoose.model('incident', incidentSchema);
module.exports = incidentModel;