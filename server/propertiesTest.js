var properties = require("properties");
var options = {
  path: true,
  variables: true
};

properties.parse ("vars", options, function (error, p){
  if (error) return console.error (error);
  PROPERTIES_VARIABLE = p;
});
