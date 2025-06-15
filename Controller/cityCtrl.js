const cityModel = require("../Models/cityModel");
const stateModel = require("../Models/stateModel");
const countryModel = require("../Models/countryModel");

const findCity = async (req, res, next) => {
  try {
    const { state_id, country_id, page, count } = req.query;
    const filter = {};
    if (state_id) {
      filter = { state_id };
    }
    if (country_id) {
      filter = { country_id };
    }
    const [city, totalCount] = await Promise.all([
      cityModel.aggregate([
        {
          $match: filter,
        },
        {
          $skip: page * count,
        },
        {
          $limit: Number(count),
        },
        {
          $lookup: {
            from: "states",
            localField: "state_id",
            foreignField: "_id",
            as: "state_id",
          },
        },
        {
          $lookup: {
            from: "countries",
            localField: "country_id",
            foreignField: "id",
            as: "country_id",
          },
        },
        {
          $addFields: {
            state_id: { $first: "$state_id.name" },
            country_id: { $first: "$country_id.name" },
          },
        },
      ]),

      cityModel.countDocuments(filter),
    ]);
    res.data = city;
    res.count = totalCount;
    res.status_Code = "200";
    next();
  } catch (error) {
    res.error = true;
    res.status_Code = "403";
    res.message = error.message;
    res.data = {};
    next();
  }
};

const findCityByName = async (req, res, next) => {
  try {
    const { search, page, count } = req.query;
    let filter = {};
    let package_filter = {companyId: req.companyId};
    if (search) {
      const [state, country] = await Promise.all([
        stateModel.findOne({ name: new RegExp(search, "i") }),
        countryModel.findOne({ name: new RegExp(search, "i") }),
      ]);
      if (state) {
        filter = {
          ...filter,
          $or: [{ name: new RegExp(search, "i") }, { state_id: state._id }],
        };
        package_filter = { 
            ...filter, 
            $or: [
              { package: new RegExp(search, 'i') }, 
              { "cities.state": state._id }
            ] 
          };
        }
      if (country) {
        filter = {
          ...filter,
          $or: [{ name: new RegExp(search, "i") }, { country_id: country._id }],
        };
        package_filter = { 
            ...filter, 
            $or: [
              { package: new RegExp(search, 'i') }, 
              { "cities.country": country._id }
            ] 
          };

        }
      if (state && country) {
        filter = {
          ...filter,
          $or: [
            { name: new RegExp(search, "i") },
            { state_id: state._id },
            { country_id: country._id },
          ],
        };

        package_filter = { 
            ...filter, 
            $or: [
              { package: new RegExp(search, 'i') }, 
              { "cities.state": state._id },
              { "cities.country": country._id },

            ] 
          };
          
      }
      if(!state && !country) {
        filter = { ...filter, name: new RegExp(search, 'i') }
        package_filter = { ...package_filter, package: new RegExp(search, 'i') }
    }
      
    }
    
    const [city, theme, package] = await Promise.all([
      cityModel.aggregate([
        {
          $match: filter,
        },
        {
          $limit: 10,
        },
        {
          $lookup: {
            from: "states",
            localField: "state_id",
            foreignField: "_id",
            as: "state_id",
          },
        },
        {
          $lookup: {
            from: "countries",
            localField: "country_id",
            foreignField: "id",
            as: "country_id",
          },
        },
        {
          $addFields: {
            state_id: { $first: "$state_id.name" },
            country_id: { $first: "$country_id.name" },
          },
        },
      ]),
      themeModel.find({ companyId: req.companyId, ...filter}).limit(10),
      packageModel.find(package_filter).limit(10).select("package cities")
    ]);
    res.data = {city, theme, package };
    res.status_Code = "200";
    next();
  } catch (error) {
    res.error = true;
    res.status_Code = "403";
    res.message = error.message;
    res.data = {};
    next();
  }
};

const findCityByState = async (req, res, next) => {
  try {
    let filter = {};
    if (req.query.id) {
      filter = { state_id: req.query.id };
    }
    const city = await cityModel.find(filter);
    res.data = city;
    res.status_Code = "200";
    next();
  } catch (error) {
    res.error = true;
    res.status_Code = "403";
    res.message = error.message;
    res.data = {};
    next();
  }
};

const cityPublic = async (req, res, next) => {
  try {
    const client = await Client.get(`city:Public`);
    let city;
    if (client == null) {
      city = await cityModel.find({ status: true });
      Client.set(`city:Public`, JSON.stringify(city));
    } else {
      city = JSON.parse(client);
    }
    res.data = city;
    res.status_Code = "200";
    next();
  } catch (error) {
    res.error = true;
    res.status_Code = "403";
    res.message = error.message;
    res.data = {};
    next();
  }
};

const getCityById = async (req, res, next) => {
  try {
    const city = await cityModel.findById(req.params.id);
    res.data = city;
    res.status_Code = "200";
    next();
  } catch (error) {
    res.error = true;
    res.status_Code = "403";
    res.message = error.message;
    res.data = {};
    next();
  }
};

const addCity = async (req, res, next) => {
  try {
    const city = await cityModel.create(req.body);
    let allKeys = await Client.keys(`city:*`);
    if (allKeys.length != 0) {
      const del = await Client.del(allKeys);
    }
    res.data = city;
    res.status_Code = "200";
    next();
  } catch (error) {
    res.error = true;
    res.status_Code = "403";
    res.message = error.message;
    res.data = {};
    next();
  }
};

const updateCity = async (req, res, next) => {
  try {
    const city = await cityModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    let allKeys = await Client.keys(`city:*`);
    if (allKeys.length != 0) {
      const del = await Client.del(allKeys);
    }
    res.data = city;
    res.status_Code = "200";
    next();
  } catch (error) {
    res.error = true;
    res.status_Code = "403";
    res.message = error.message;
    res.data = {};
    next();
  }
};

const deleteCity = async (req, res, next) => {
  try {
    const city = await cityModel.findByIdAndDelete(req.params.id);
    let allKeys = await Client.keys(`city:*`);
    if (allKeys.length != 0) {
      const del = await Client.del(allKeys);
    }
    res.data = city;
    res.status_Code = "200";
    next();
  } catch (error) {
    res.error = true;
    res.status_Code = "403";
    res.message = error.message;
    res.data = {};
    next();
  }
};

const pagination = async (req, res, next) => {
  try {
    const { state_id, country_id } = req.body;
    let filter = {};
    if (state_id) {
      filter = { state_id: new mongoose.Types.Object() };
    }
    let city;
    let count;
    [city, count] = await Promise.all([
      cityModel.aggregate([
        {
          $skip: req.query.count * req.query.page,
        },
        {
          $limit: Number(req.query.count),
        },
      ]),
      cityModel.countDocuments(),
    ]);
    res.data = { city, count };
    res.status_Code = "200";
    next();
  } catch (error) {
    res.error = true;
    res.status_Code = "403";
    res.message = error.message;
    res.data = {};
    next();
  }
};

module.exports = {
  findCity,
  getCityById,
  addCity,
  updateCity,
  deleteCity,
  pagination,
  cityPublic,
  findCityByState,
  findCityByName
};
