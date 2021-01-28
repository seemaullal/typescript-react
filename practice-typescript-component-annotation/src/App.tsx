import * as React from "react";

type PokemonType = {
  name: string;
  sprites: { other: { dream_world: { front_default: string } } };
  url: string;
};
type PokemonProps = { url: string };

class Pokemon extends React.Component<
  PokemonProps,
  { pokemon: PokemonType | null }
> {
  state: { pokemon: PokemonType | null } = { pokemon: null };

  getPokemon = async () => {
    const response = await fetch(this.props.url);
    const data: PokemonType = await response.json();
    this.setState({ pokemon: data });
  };
  componentDidMount() {
    this.getPokemon();
  }
  render() {
    if (!this.state.pokemon) return null;
    return (
      <li className="pokemon">
        <img
          alt={this.state.pokemon?.name}
          src={this.state.pokemon?.sprites?.other?.dream_world?.front_default}
        />
        <strong>{this.state.pokemon.name}</strong>
      </li>
    );
  }
}

type PokeListProps = {};
type PokeListState = {
  page_num: number;
  pokemon_list: PokemonType[] | null;
};
const PAGE_SIZE = 50;
export default class PokeList extends React.Component<
  PokeListProps,
  PokeListState
> {
  state: PokeListState = { page_num: 0, pokemon_list: null };
  getPokemonList = async () => {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${
        this.state.page_num * PAGE_SIZE
      }`
    );
    const data: { results: PokemonType[] } = await response.json();
    this.setState({ pokemon_list: data.results });
  };
  componentDidMount() {
    this.getPokemonList();
  }
  componentDidUpdate(prevProps: PokeListProps, prevState: PokeListState) {
    if (prevState.page_num !== this.state.page_num) {
      this.setState({ pokemon_list: null });
      this.getPokemonList();
    }
  }
  render() {
    return (
      <div>
        {this.state.page_num >= 1 && (
          <button
            onClick={() => {
              this.setState((state) => ({ page_num: state.page_num - 1 }));
            }}
          >
            Prev
          </button>
        )}
        <button
          onClick={() => {
            this.setState((state) => ({ page_num: state.page_num + 1 }));
          }}
        >
          Next
        </button>
        <ul>
          {this.state.pokemon_list?.map((pokemon) => (
            <Pokemon key={pokemon.url} url={pokemon.url} />
          ))}
        </ul>
      </div>
    );
  }
}
