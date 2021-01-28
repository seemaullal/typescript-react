import React, { useState, useEffect } from "react";

type PokemonType = {
  name: string;
  sprites: { other: { dream_world: { front_default: string } } };
  url: string;
};

function Pokemon({ url }: { url: string }) {
  const [pokemon, setPokemon] = useState<PokemonType | null>(null);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data: PokemonType) => setPokemon(data));
  }, [url]);

  if (!pokemon) return null;
  return (
    <li className="pokemon">
      <img
        alt={pokemon.name}
        src={pokemon?.sprites?.other?.dream_world?.front_default}
      />
      <strong>{pokemon.name}</strong>
    </li>
  );
}

const PAGE_SIZE = 50;

export default function PokeList() {
  const [pageNum, setPageNum] = useState<number>(0);
  const [pokeList, setPokeList] = useState<PokemonType[] | null>(null);
  useEffect(() => {
    fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${
        pageNum * PAGE_SIZE
      }`
    ).then((response) => {
      response.json().then((data: { results: PokemonType[] }) => {
        setPokeList(data.results);
      });
    });
  }, [pageNum]);
  return pokeList ? (
    <div>
      {pageNum >= 1 && (
        <button onClick={() => setPageNum((pageNum) => pageNum - 1)}>
          Prev
        </button>
      )}
      <button onClick={() => setPageNum((pageNum) => pageNum + 1)}>Next</button>
      <ul>
        {pokeList?.map((pokemon) => (
          <Pokemon key={pokemon.url} url={pokemon.url} />
        ))}
      </ul>
    </div>
  ) : null;
}
