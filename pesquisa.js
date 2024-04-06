function searchBooks() {
    const searchInput = document.getElementById('searchInput').value;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${searchInput}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Ordenar os livros pelo número de avaliações em ordem decrescente
            const sortedBooks = data.items.sort((a, b) => {
                const aRatingsCount = a.volumeInfo.ratingsCount || 0;
                const bRatingsCount = b.volumeInfo.ratingsCount || 0;
                return bRatingsCount - aRatingsCount;
            });
            displayBooks(sortedBooks);
        })
        .catch(error => {
            console.log(error);
            displayUnavailableMessage();
        });
}

function displayBooks(books) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (books.length === 0) {
        displayUnavailableMessage();
        return;
    }

    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book');

        const title = document.createElement('h2');
        title.textContent = book.volumeInfo.title;

        const authors = document.createElement('p');
        authors.textContent = `Authors: ${book.volumeInfo.authors}`;

        const genre = document.createElement('p');
        genre.textContent = `Genre: ${book.volumeInfo.categories ? book.volumeInfo.categories.join(', ') : 'Not available'}`;

        const img = document.createElement('img');
        img.src = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150'; 

        const description = document.createElement('p');
        description.textContent = book.volumeInfo.description ? book.volumeInfo.description : 'Description not available';

        const buyLink = document.createElement('a');
        if (book.saleInfo && book.saleInfo.buyLink) {
            buyLink.href = book.saleInfo.buyLink;
            buyLink.textContent = "Comprar";
            buyLink.target = "_blank";
        } else {
            buyLink.textContent = "Item indisponível para compra";
            buyLink.style.color = "red";
            buyLink.style.cursor = "not-allowed";
            buyLink.addEventListener('click', function(event) {
                event.preventDefault();
            });
        }

        bookDiv.appendChild(img);
        bookDiv.appendChild(title);
        bookDiv.appendChild(authors);
        bookDiv.appendChild(description);
        bookDiv.appendChild(genre);
        bookDiv.appendChild(buyLink);

        resultsDiv.appendChild(bookDiv);
    });
}

function displayUnavailableMessage() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const message = document.createElement('p');
    message.textContent = "Nenhum livro encontrado ou erro na pesquisa. Por favor, tente novamente mais tarde.";
    resultsDiv.appendChild(message);
}
