describe("Testing the moviesite", () => {
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
          Poster: "https://cdn.kinocheck.com/i/mnatveje6f.jpg",
        },
        {
          Title: "Blade Runner 2049",
          Year: "2017",
          imdbID: "tt1856101",
          Type: "movie",
          Poster:
            "https://images.cdn.yle.fi/image/upload/f_auto,fl_progressive/q_auto/w_2136,h_1201,c_crop,x_197,y_0/w_400/dpr_2/v1507231570/39-43367959d68706162d4.jpg",
        },
      ],
    }).as("myapicall");

    cy.get("button:first").click();
    cy.get(".movie").should("have.length", 2);
    cy.get("h3:first").should("have.text", "Blade Runner");
  });

  it("Should contain img in movie container", () => {
    cy.visit("/");
    cy.intercept("http://omdbapi.com/*", {
      Search: [
        {
          Title: "Blade Runner",
          Year: "1982",
          imdbID: "tt0083658",
          Type: "movie",
          Poster: "https://cdn.kinocheck.com/i/mnatveje6f.jpg",
        },
        {
          Title: "Blade Runner 2049",
          Year: "2017",
          imdbID: "tt1856101",
          Type: "movie",
          Poster:
            "https://images.cdn.yle.fi/image/upload/f_auto,fl_progressive/q_auto/w_2136,h_1201,c_crop,x_197,y_0/w_400/dpr_2/v1507231570/39-43367959d68706162d4.jpg",
        },
      ],
    });

    cy.get("button:first").click();
    cy.get(".movie").find("img");
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
            "https://images.cdn.yle.fi/image/upload/f_auto,fl_progressive/q_auto/w_2136,h_1201,c_crop,x_197,y_0/w_400/dpr_2/v1507231570/39-43367959d68706162d4.jpg",
        },
      ],
    }).as("myapicall");
    cy.get("input#searchText").type("Blade Runner 2049");
    cy.get("button").click();
    cy.wait("@myapicall").its("request.url").should("contain", "Blade");
  });

  it("Should show error message and statuscode 500", () => {
    cy.visit("/");
    cy.intercept("GET", "http://omdbapi.com/*", {
      statusCode: 500,
    });

    cy.get("input#searchText");
    cy.get("button").click();
    cy.get("#movie-container>p").should(
      "have.text",
      "Inga sökresultat att visa"
    );
  });
});