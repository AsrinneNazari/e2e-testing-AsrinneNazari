describe("Fetching api", () => {
  it("Should list movies from api", () => {
    cy.visit("/");
    cy.get("input#searchText").type("dune{enter}");
    cy.get("button").click();
    cy.get("#movie-container").should("have.length.greaterThan", 0);
  });

  it("Should list my movies", () => {
    cy.visit("/");
    cy.intercept("http://omdbapi.com/*", {
      Search: [
        {
          Title: "Blade Runner",
          Year: "1982",
          imdbID: "tt0083658",
          Type: "movie",
          Poster:
            "https://m.media-amazon.com/images/M/MV5BNzQzMzJhZTEtOWM4NS00MTdhLTg0YjgtMjM4MDRkZjUwZDBlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
        },
        {
          Title: "Blade Runner 2049",
          Year: "2017",
          imdbID: "tt1856101",
          Type: "movie",
          Poster:
            "https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_SX300.jpg",
        },
      ],
    }).as("myapicall");

    cy.get("button:first").click();
    cy.get(".movie").should("have.length", 2);
    cy.get("h3:first").should("have.text", "Blade Runner");
  });

  it("Should get right URL", () => {
    cy.visit("/");
    cy.intercept("http://omdbapi.com/*", {
      Search: [
        {
          Title: "Blade Runner 2049",
          Year: "2017",
          imdbID: "tt1856101",
          Type: "movie",
          Poster:
            "https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_SX300.jpg",
        },
      ],
    }).as("myapicall");
    cy.get("input#searchText").type("Blade Runner 2049");
    cy.get("button").click();
    cy.wait("@myapicall").its("request.url").should("contain", "Blade");
  });

  it("Should show error message", () => {
    cy.visit("/");
    cy.get("input#searchText");
    cy.get("button").click();
    cy.get("#movie-container>p").should(
      "have.text",
      "Inga sökresultat att visa"
    );
  });
});
