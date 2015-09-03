var allowedTypes = {
  "eq": true,
  "ne": true,
  "gt": true,
  "gte": true,
  "lt": true,
  "lte": true,
  "in": true,
  "range": true
};

function err(res, code, message) {
  res.status(code);
  res.send(message);
}

function parseValue(valueString) {
  if (valueString.length > 2 && valueString[0] == '"' && valueString[valueString.length-1] == '"') {
    if (valueString.length > 3) {
      return valueStriing.substring(1, valueStriing.length - 2);
    } else {
      return ""
    }
  } else if (valueString.length > 2 && valueString[0] == '[' && valueString[valueString.length-1] == ']') {
    if (valueString.length > 3) {
      var arrayContentString = valueString.substring(1, valueString.length - 2);
      var arrayContentStringArray = arrayContentString.split(',');
      var resultArray = [];
      for (var i = 0; i < arrayContentStringArray; i++) {
        order.push(parseValue(arrayContentStringArray));
      }
      return resultArray;
    } else {
      return []
    }
  } else {
    return parseInt(valueString)
  }
}

module.exports =function(req, res, next) {
  if (!req.swagger) return next();

  try {
    if (req.swagger.params.order) {
      var orderString = req.swagger.params.order.value;
      var orderArray = orderString.split(';');
      var order = [];
      for (var i = 0; i < orderArray; i++) {
        var orderItemArray = orderArray[i].split(' ');
        order.push([orderItemArray[0], (orderItemArray.length > 1) ? orderItemArray[1] : 'asc']);
      }
      req.api.order = order;
    }

    if (req.swagger.params.range) {
      var rangeString = req.swagger.params.range.value;
      var rangeArray = rangeString.split(' ');
      req.api.range.limit = parseInt(rangeArray[0]);
      req.api.range.offset = (rangeArray.length > 1) ? rangeArray[1] : 0;
    }

    if (req.swagger.params.filter) {
      var filterString = req.swagger.params.filter.value;
      var filterArray = filterString.split(';');
      var filter = {};
      for (var i = 0; i < filterArray; i++) {
        var filterItemArray = filterArray[i].split(' ');
        if (filterItemArray.length < 3) {
          return err(res, 400, "filter " + filterString + "error");
        }

        var filterItemField = filterItemArray[0];
        var filterItemType = filterItemArray[1];
        var filterItemValue = filterItemArray[2];

        if (!allowedTypes[filterItemType]) {
          return err(res, 400, "filter type " + filterItemType + " is not allowed");
        }

        var filterItemParsedValue;

        filterItemParsedValue = parseValue(filterItemValue);

        var filterItem = {};
        filterItem[filterItemType] = filterItemParsedValue;

        filter[filterItemField] = filterItem
      }
      req.api.filter = filter;
    }
  } catch (err) {
    return err(res, 400, "Internal Error");
  }

  next();
};