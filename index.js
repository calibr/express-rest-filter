var allowedTypes = {
  "eq": true,
  "ne": true,
  "gt": true,
  "gte": true,
  "lt": true,
  "lte": true,
  "in": true
};

function err(res, code, message) {
  res.status(code);
  res.send(message);
}

module.exports = function(req, res, next) {
  if(req.method !== "GET") {
    return next();
  }
  var query = req.query;
  if(!query) {
    return next();
  }
  if(!query.filterFields) {
    return next();
  }
  var fields = query.filterFields;
  if(!(fields instanceof Array)) {
    fields = [fields];
  }
  var filterObject = {};
  for(var i = 0; i != fields.length; i++) {
    var field = fields[i];
    var type = query["filterType_" + field];
    if(!type) {
      return err(res, 400, "filterType_" + field + " should be specified");
    }
    if(!allowedTypes[type]) {
      return err(res, 400, "filter type " + type + " is not allowed");
    }
    var valueKey = "filterValue_" + field;
    if(!(valueKey in query)) {
      return err(res, 400, valueKey + " should be specified");
    }
    var value = query[valueKey];
    filterObject[field] = {};
    if(type === "eq") {
      filterObject[field] = value;
    }
    else {
      filterObject[field][type] = value;
    }
  }
  req.api.filter = filterObject;
  next();
};