const responseSend = async (req, res, next) => {
    res.json({
      error: res?.error != undefined ? res.error : false,
      statusCode: res?.status_Code != undefined ? res.status_Code : "404",
      message: res.message != undefined ? res.message : "Success",
      data: res.data,
    });
  };
  
  
  module.exports = { responseSend };