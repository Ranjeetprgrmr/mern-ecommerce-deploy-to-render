const Feature = require('../../models/Feature');

const addFeatureImage = async(req, res) => {
    try{

        const {image} = req.body;

        console.log('image', image);

        const featureImages = new Feature({
            image,
        })

        await featureImages.save();

        res.status(201).json({
            success : true, 
            data : featureImages
        })

    } catch(error){
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Error occured'
        })
    }
}

const getFeatureImages = async(req, res) => {
    try{

        const images = await Feature.find({});

        res.status(200).json({
            success : true,
            data : images
        })

    } catch(error){
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Error occured'
        })
    }
}

module.exports = {addFeatureImage, getFeatureImages}