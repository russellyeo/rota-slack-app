class Rota {
  constructor(name, description) {
    this.name = name;
    this.description = description;
  }
}


const rotas = [
  Rota('Rota 1', 'Description 1'),
  Rota('Rota 2', 'Description 2'),
  Rota('Rota 3'),
  Rota('Rota 4', 'Description 4'),
  Rota('Rota 5'),
]

module.exports = { Rota };