function searchBooks() {
    const searchInput = document.getElementById('searchInput').value;
    const genre = document.getElementById('genre').value;
    let url = `https://www.googleapis.com/books/v1/volumes?q=${searchInput}`;

    if (genre) {
        url += `+subject:${genre}`;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }
            return response.json();
        })
        .then(data => {
            // Classificar os livros pelo número de avaliações em ordem decrescente
            const sortedBooks = data.items.sort((a, b) => {
                const aRatings = a.volumeInfo.ratingsCount || 0;
                const bRatings = b.volumeInfo.ratingsCount || 0;
                return bRatings - aRatings;
            });
            displayBooks(sortedBooks);
        })
        .catch(error => {
            console.error('Failed to fetch books:', error);
            displayUnavailableMessage();
        });
}

function displayBooks(books) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (!books || books.length === 0) {
        displayUnavailableMessage();
        return;
    }

    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book');

        const title = document.createElement('h2');
        title.textContent = book.volumeInfo.title;

        const authors = document.createElement('p');
        authors.textContent = `Authors: ${book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Not available'}`;

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
        }

        bookDiv.appendChild(img);
        bookDiv.appendChild(title);
        bookDiv.appendChild(authors);
        bookDiv.appendChild(description);
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
