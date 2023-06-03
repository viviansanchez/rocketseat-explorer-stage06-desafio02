import { GithubUser } from "./GithubUser.js"

class Favorites {
  constructor (root) {
    this.root = document.querySelector(root)

    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@desafio-gitfav:')) || []
  }

  save() {
    localStorage.setItem('@desafio-gitfav:', JSON.stringify(this.entries))
  }

  async add(username) {
    try { 
      const userExists = this.entries.find(entry => entry.login === username)
      
      if(userExists) {
        throw new Error('Usuário já cadastrado')
      }

      const user = await GithubUser.search(username)

      if(user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()
      this.checkUsersInArray()

    } catch(error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter((entry) => entry.login !== user.login)
    this.entries = filteredEntries

    this.update()
    this.save()
    this.checkUsersInArray()
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.checkUsersInArray()

    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector('header .input-wrapper button')
    addButton.addEventListener('click', () => {
      const { value } = this.root.querySelector('header .input-wrapper input')

      this.add(value)
    })
  }

  update() {

    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow()
      
      
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user a p').textContent = `${user.name}`
      row.querySelector('.user a span').textContent = `${user.login}`
      row.querySelector('.repositories').textContent = `${user.public_repos}`
      row. querySelector('.followers').textContent = `${user.followers}`

      row.querySelector('.remove button').addEventListener('click', () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')

        if(isOk) {
          this.delete(user) 
        }
      })

      this.tbody.append(row)
    })
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach(tr => {tr.remove()});
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <tr>
        <td class="user">
          <img
            src="https://github.com/viviansanchez.png"
            alt="Imagem de viviansanchez"
          />
          <a href="https://github.com/viviansanchez" target="_blank">
            <p>Vivian Sanchez</p>
            <span>/viviansanchez</span>
          </a>
        </td>
        <td class="repositories">44</td>
        <td class="followers">6</td>
        <td class="remove"><button>Remover</button></td>
      </tr>
    `
    return tr
  }

  checkUsersInArray() {
    const noFavoritesScreen = this.root.querySelector('.no-favorites-screen')

    if(this.entries.length >= 1) {
      this.tbody.classList.remove('hide')
      noFavoritesScreen.classList.add('hide')
    } else {
      this.tbody.classList.add('hide')
      noFavoritesScreen.classList.remove('hide')
    }
  }
}