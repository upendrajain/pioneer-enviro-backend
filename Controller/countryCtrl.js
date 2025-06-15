const countryModel = require("../Models/countryModel")

const findCountry = async(req,res,next)=>{
    try{
        const country = await countryModel.find();
        res.data = country
        res.status_Code = "200"
        next()
    }catch(error){
        res.error = true;
        res.status_Code = "403";
        res.message = error.message
        res.data = {}
        next()
    }
}

const countryPublic = async(req,res,next)=>{
    try{
        const country = await countryModel.find({ status: true });            
        res.data = country
        res.status_Code = "200"
        next()
    }catch(error){
        res.error = true;
        res.status_Code = "403";
        res.message = error.message
        res.data = {}
        next()
    }
}

const getCountryById = async(req,res,next)=>{
    try{
        const country = await countryModel.findById(req.params.id);
        res.data = country
        res.status_Code = "200"
        next()
    }catch(error){
        res.error = true;
        res.status_Code = "403";
        res.message = error.message
        res.data = {}
        next()
    }
}

const addCountry = async(req,res,next)=>{
    try{
        const country = await countryModel.create(req.body);
        let allKeys = await Client.keys(`country:*`);
        if(allKeys.length != 0) {
          const del = await Client.del(allKeys);
        }            
        res.data = country
        res.status_Code = "200"
        next()
    }catch(error){
        res.error = true;
        res.status_Code = "403";
        res.message = error.message
        res.data = {}
        next()
    }
}

const updateCountry = async(req,res,next)=>{
    try{
        const country = await countryModel.findByIdAndUpdate(req.params.id,req.body,{new:true});
        let allKeys = await Client.keys(`country:*`);
        if(allKeys.length != 0) {
          const del = await Client.del(allKeys);
        }
        res.data = country
        res.status_Code = "200"
        next()
    }catch(error){
        res.error = true;
        res.status_Code = "403";
        res.message = error.message
        res.data = {}
        next()
    }
}

const deleteCountry = async(req,res,next)=>{
    try{
        const country = await countryModel.findByIdAndDelete(req.params.id);
        let allKeys = await Client.keys(`country:*`);
        if(allKeys.length != 0) {
          const del = await Client.del(allKeys);
        }
        res.data = country
        res.status_Code = "200"
        next()
    }catch(error){
        res.error = true;
        res.status_Code = "403";
        res.message = error.message
        res.data = {}
        next()
    }
}

const pagination = async (req, res, next) => {
    try {
        let country;
        let count;
            [country, count] = await Promise.all([countryModel.aggregate([
                {
                    $skip: req.params.count * req.params.page
                },
                {
                    $limit: Number(req.params.count)
                }
            ]), countryModel.countDocuments()]);
        res.data = {country, count}
        res.status_Code = "200"
        next()
    } catch (error) {
        res.error = true;
        res.status_Code = "403";
        res.message = error.message
        res.data = {}
        next()
    }
}


module.exports = {findCountry, getCountryById, addCountry, updateCountry, deleteCountry, pagination, countryPublic}
