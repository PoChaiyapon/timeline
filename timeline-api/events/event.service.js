const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

module.exports = {
  getEventByOwner,
  create
};

//[2021-09-01 PO]
async function getEventByOwner(id) {
    //await db.User.findOne({ where: { username: params.username } })
    // const user = await db.User.findOne({where : { id: id}});
  const event = await db.Event.findAll({ where: { owner: id } });
    if(!event) throw 'Event not found';
    return event;
}

async function create(params){
  console.log(params);
  //validate
  if(!await db.User.findOne({where: {id: params.owner}})){
    throw 'Owner id: "' + params.owner + '" not found';
  }

  //save event
  await db.Event.create(params);

}