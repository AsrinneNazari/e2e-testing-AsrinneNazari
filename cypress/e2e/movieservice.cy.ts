describe("Fetching api test", () => {

it("should list movies", () => {
  cy.visit("/")
  cy.intercept("GET", "http://omdbapi.com/?apikey=d3d33238&s=")
  cy.get("input#searchText")
  .type("dune{enter}");
  cy.get("button").click(); 
  cy.get("#movie-container").should("have.length.greaterThan",0)
})

it("should list my movies", () => {
  cy.visit("/")
  cy.intercept("http://omdbapi.com/*",
  {Search:
    [{
    "Title": "Blade Runner",
    "Year": "1982",
    "imdbID": "tt0083658",
    "Type": "movie",
    "Poster": "https://m.media-amazon.com/images/M/MV5BNzQzMzJhZTEtOWM4NS00MTdhLTg0YjgtMjM4MDRkZjUwZDBlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg"
    },
    {
    "Title": "Blade Runner 2049",
    "Year": "2017",
    "imdbID": "tt1856101",
    "Type": "movie",
    "Poster": "https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_SX300.jpg"
    }
  ]}
  )
  cy.get("button:first").click(); 
  cy.get(".movie").should("have.length",2)
})

it("should show error message", ()=>{
  cy.visit("/")
  cy.get("input#searchText")
  cy.get("button").click(); 
  cy.get("#movie-container").should("have.text","Inga sökresultat att visa")
})
})
