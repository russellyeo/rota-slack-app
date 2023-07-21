class Rota {
  constructor(rotaDescription, assigned, users) {
    this.rota = rotaDescription;
    this.assigned = assigned;
    this.users = users;
  }
}

class RotaDescription {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }
}

module.exports = { Rota, RotaDescription };