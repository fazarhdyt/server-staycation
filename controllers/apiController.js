const Item = require('../models/Item')
const Treasure = require('../models/Activity')
const Traveler = require('../models/Booking')
const Category = require('../models/Category')
const Bank = require('../models/Bank')

module.exports = {
    landingPage: async (req, res) => {
        try {
            const mostPicked = await Item.find()
            .select('_id title country city price unit imageId')
            .limit(5)
            .populate({path: 'imageId', select: '_id imageUrl'})
            
            const category = await Category.find()
            .select('_id name')
            .limit(3)
            .populate({
                path: 'itemId',
                select: '_id title country city isPopular imageId',
                perDocumentLimit: 4,
                option: {sort: {sumBooking: -1}},
                populate: {
                    path: 'imageId',
                    select: '_id imageUrl',
                    perDocumentLimit: 1
                }
            })

            const traveler = await Traveler.find()
            const treasure = await Treasure.find()
            const city = await Item.find()

            for(let i = 0; i < category.length; i++){
                for(let j = 0; j < category[i].itemId.length; j++){
                    const item = await Item.findOne({_id: category[i].itemId[j]._id})
                    item.isPopular = false
                    await item.save()

                    if(category[i].itemId[0] === category[i].itemId[j]){
                        item.isPopular = true
                        await item.save()
                    }
                }
            }

            const testimonial = {
                _id: 'asd1293uasdads1',
                imageUrl: 'images/testimonial2.jpg',
                name: 'Happy Familiy',
                rate: 4.55,
                content: 'What a great trip with my family and I should try again next time soon ...',
                familyName: 'Angga',
                familyOccupation: 'Product Designer'
            }

            res.status(200).json({
                hero: {
                    travelers: traveler.length,
                    treasures: treasure.length,
                    cities: city.length
                },
                mostPicked,
                category,
                testimonial
            })
            
        } catch (error) {
            res.status(500).json({message: 'intenal server error'})
        }
    },

    detailPage: async (req, res) => {
        try {
            const {id} = req.params
            const item = await Item.findOne({_id: id})
            .populate({path: 'featureId', select: '_id name imageUrl qty'})
            .populate({path: 'activityId', select: '_id name imageUrl type'})
            .populate({path: 'imageId', select: '_id imageUrl'})

            const bank = await Bank.find()

            const testimonial = {
                _id: 'asd1293uasdads1',
                imageUrl: 'images/testimonial1.jpg',
                name: 'Happy Familiy',
                rate: 4.55,
                content: 'What a great trip with my family and I should try again next time soon ...',
                familyName: 'Angga',
                familyOccupation: 'Product Designer'
            }

            res.status(200).json({
                ...item._doc,
                bank,
                testimonial
            })
        } catch (error) {
            
        }
    }
}