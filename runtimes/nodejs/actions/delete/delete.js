// Load the Cloudant library.
var common = require('./common/utils.js')
var content_type_header = {'Content-Type': 'application/json'}

var todo_db_name = "todos"

function deleteHandler(params) {
  var api_root_url = params.base_url;
  cloudant = common.getDb(params)

  return new Promise(function(resolve, reject) {
    common.asyncSafeDbCreate(cloudant.db, todo_db_name)
    .then(function() {
      todo_db = cloudant.db.use(todo_db_name)
      todo_id = common.getToDoID(params)
      if (todo_id == "") {
        console.log("Rejecting delete, no ID specified")
        // If not defined, we send a 400 error.
        reject({
          statusCode: 400,
          headers: content_type_header,
          body: {
            error: "Cannot DELETE on the root path. A TODO ID is needed."
          }
        })
      } else {
        return common.asyncToDoDelete(todo_db, api_root_url, todo_id)
      }
    })
    .then(common.resolveSuccessFunction(resolve))
    .catch(common.rejectErrorsFunction(reject))
  })
}

exports.main = deleteHandler;
