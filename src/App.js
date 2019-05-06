import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import img from "./cute.png";
import search from "./search.png";

const COLORS = {
  Psychic: "#f8a5c2",
  Fighting: "#f0932b",
  Fairy: "#c44569",
  Normal: "#f6e58d",
  Grass: "#badc58",
  Metal: "#95afc0",
  Water: "#3dc1d3",
  Lightning: "#f9ca24",
  Darkness: "#574b90",
  Colorless: "#FFF",
  Fire: "#eb4d4b"
};

class App extends Component {
  state = {
    pokemons: [],
    hidden: true,
    myPokemons: [],
    text: ""
  };

  getData = async () => {
      try {
          const resp = await axios.get("http://localhost:3030/api/cards");
          this.setState({ pokemons: resp.data.cards });
      } catch (error) {
        
      }
  };

  closeModal = e => {
    if (e.target.className === "modal") this.setState({ hidden: true });
  };

  showModal = () => {
    this.setState({ hidden: false });
  };

  componentDidMount() {
    this.getData();
  }

  search = e => {
    this.setState({ text: e });
    if (e.length === 0) {
      this.getData();
    } else {
      const input = e;
      let result = this.state.pokemons.filter(data => {
        let searchName = data.name.toLowerCase().search(input);
        let searchType = data.type.toLowerCase().search(input);
        if (searchName !== -1 || searchType !== -1) {
          return data.name;
        }
        return null;
      });
      this.setState({ pokemons: result });
    }
  };

  renderPokemonCard = () => {
    return (
      <div>
        {this.state.pokemons.map((data, index) => (
          <div key={index} className="pokenmon-cards-container" >
            <img src={data.imageUrl} alt={data.imageUrl} className="modal-img"  />
            <div className="data">
              <span className="name">{data.name}</span>
              <span className="add-pokemon" onClick={e => this.addPokemon(index)} >
                ADD
              </span>
              <div className="status-container">
                <div className="status-wrapper">
                  <span className="status">HP :</span>
                  {this.renderRate(data.hp, "hp")}
                </div>
                <div className="status-wrapper">
                  <span className="status">STR :</span>{" "}
                  {this.renderRate(data.attacks, "str")}
                </div>
                <div className="status-wrapper">
                  <span className="status">WEAK :</span>
                  {this.renderRate(data.weaknesses, "weakness")}
                </div>
                <div className="status-wrapper">
                  {this.renderRate(
                    [data.hp, data.attacks, data.weakness],
                    "happiness"
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  addPokemon = index => {
    const myPokemons = this.state.myPokemons;
    const pokemons = this.state.pokemons;
    const selectedPokemon = this.state.pokemons[index];
    pokemons.splice(index, 1);
    myPokemons.push(selectedPokemon);
    this.setState({ myPokemons, pokemons });
  };

  removePokemon = index => {
    const myPokemons = this.state.myPokemons;
    const pokemons = this.state.pokemons;
    const selectedPokemon = this.state.myPokemons[index];
    myPokemons.splice(index, 1);
    pokemons.push(selectedPokemon);
    this.setState({ myPokemons, pokemons });
  };

  renderRate = (rate, stat) => {
    switch (stat) {
      case "hp": {
        if (rate >= 100) {
          rate = 100;
        }
        if (rate === 0 || rate === "None") {
          rate = 0;
        }
        let style = rate.toString() + "%";
        return (
          <div className="rate-container">
            <div className="rate" style={{ width: style }} />
          </div>
        );
      }
      case "str": {
        let attacks = 0;
        if (rate) {
          attacks = rate.length * 50;
        } else {
          attacks = 0;
        }
        const style = attacks.toString() + "%";
        return (
          <div className="rate-container">
            <div className="rate" style={{ width: style }} />
          </div>
        );
      }
      case "weakness": {
        let weakness = 0;
        if (rate) {
          weakness = 100;
        } else {
          weakness = 0;
        }
        const style = weakness.toString() + "%";
        return (
          <div className="rate-container">
            <div className="rate" style={{ width: style }} />
          </div>
        );
      }
      case "happiness": {
        let hp = 0;
        let attacks = 0;
        let weakness = 0;

        // cal hp
        if (rate[0] >= 100) {
          hp = 100;
        }
        if (rate[0] === 0 || rate[0] === "None") {
          hp = 0;
        }

        //cal attacks
        if (rate[1]) {
          attacks = rate[1].length * 50;
        } else {
          attacks = 0;
        }

        //cal weakness
        if (rate[2]) {
          weakness = 100;
        } else {
          weakness = 0;
        }

        let arr = [];
        const happiness = (hp / 10 + attacks / 10 + 10 - weakness) / 5;
        for (let x = 1; x <= happiness; x++) {
          arr.push(<img src={img} alt={img} style={{ width: "40px" }} />);
        }
        return <div>{arr.map(data => data)}</div>;
      }
      default :break;
    }
  };

  render() {
    return (
      <div className="App">
        <div className="modal" hidden={this.state.hidden} onClick={e => this.closeModal(e)}>
          <div className="modal-content">
            <div className="search">
              <input
                type="text"
                onChange={e => this.search(e.target.value)}
                value={this.state.text}
                className="search-box"
                placeholder="find pokemon"
              />
                <img className="icon-search" src={search} alt="search" />
            </div>
            {this.renderPokemonCard()}
          </div>
        </div>
        <h1 style={{ textAlign: "center" }}>My Pokedex</h1>
        <div className="show-my-pokemon" >
          {this.state.myPokemons.map((data, index) => (
            <div className="my-pokemon-card">
              <img src={data.imageUrl} alt={data.imageUrl} className="img" />
              <div className="data">
                <span className="name">{data.name}</span>
                <span
                  className="remove-pokemon"
                  onClick={e => this.removePokemon(index)}
                >
                X
                </span>
                <div className="modal-info" />
                <div className="status-wrapper">
                  <span className="status-mypokemon">HP :</span>{" "}
                  {this.renderRate(data.hp, "hp")}
                </div>
                <div className="status-wrapper">
                  <span className="status-mypokemon">STR :</span>{" "}
                  {this.renderRate(data.attacks, "str")}
                </div>
                <div className="status-wrapper">
                  <span className="status-mypokemon">WEAK :</span>
                  {this.renderRate(data.weaknesses, "weakness")}
                </div>
                <div className="status-wrapper">
                  {this.renderRate(
                    [data.hp, data.attacks, data.weakness],
                    "happiness"
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bottom-bar">
          <div className="modal-btn" onClick={this.showModal}>
            <span className="icon">+</span>
          </div>
        </div>
      </div>
    );
  }
}

export default App;