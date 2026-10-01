let items = JSON.parse(localStorage.getItem("libraryItems")) || [
    { title: "The Alchemist", type: "Book", genre: "Fiction", rating: 8.5 },
    { title: "Inception", type: "Movie", genre: "Sci-Fi", rating: 9.0 },
    { title: "Harry Potter", type: "Book", genre: "Fantasy", rating: 9.2 },
    { title: "3 Idiots", type: "Movie", genre: "Drama", rating: 8.8 },
    { title: "Interstellar", type: "Movie", genre: "Sci-Fi", rating: 9.1 },
    { title: "Atomic Habits", type: "Book", genre: "Self Help", rating: 8.7 }
];

let currentPage = 1;
const itemsPerPage = 4;

function saveItems() {
    localStorage.setItem("libraryItems", JSON.stringify(items));
}

function addItem() {
    const title = document.getElementById("title").value.trim();
    const type = document.getElementById("type").value;
    const genre = document.getElementById("genre").value.trim();
    const rating = Number(document.getElementById("rating").value);
    const message = document.getElementById("message");

    if (!title || !genre || isNaN(rating) || rating < 0 || rating > 10) {
        message.style.color = "red";
        message.textContent = "Please enter valid details.";
        return;
    }

    items.push({ title, type, genre, rating });
    saveItems();

    document.getElementById("title").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("rating").value = "";

    message.style.color = "green";
    message.textContent = "Item added successfully.";
    currentPage = 1;
    updateGenreFilter();
    showItems();
}

function deleteItem(index) {
    items.splice(index, 1);
    saveItems();
    updateGenreFilter();
    showItems();
}

function updateGenreFilter() {
    const select = document.getElementById("filterGenre");
    const oldValue = select.value;

    const genres = [...new Set(items.map(item => item.genre))].sort();

    select.innerHTML = '<option value="All">All Genres</option>';

    genres.forEach(genre => {
        const option = document.createElement("option");
        option.value = genre;
        option.textContent = genre;
        select.appendChild(option);
    });

    if (genres.includes(oldValue)) {
        select.value = oldValue;
    }
}

function getFilteredItems() {
    const search = document.getElementById("search").value.toLowerCase();
    const type = document.getElementById("filterType").value;
    const genre = document.getElementById("filterGenre").value;

    return items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(search);
        const matchesType = type === "All" || item.type === type;
        const matchesGenre = genre === "All" || item.genre === genre;

        return matchesSearch && matchesType && matchesGenre;
    });
}

function showItems() {
    const library = document.getElementById("library");
    const filtered = getFilteredItems();

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const pageItems = filtered.slice(start, start + itemsPerPage);

    library.innerHTML = "";

    if (pageItems.length === 0) {
        library.innerHTML = '<div class="empty">No items found.</div>';
        showPagination(0);
        return;
    }

    pageItems.forEach(item => {
        const originalIndex = items.indexOf(item);

        library.innerHTML += `
            <div class="card">
                <span class="badge">${item.type}</span>
                <h3>${escapeHTML(item.title)}</h3>
                <p><b>Genre:</b> ${escapeHTML(item.genre)}</p>
                <p><b>Rating:</b> ${item.rating}/10</p>
                <button class="delete-btn" onclick="deleteItem(${originalIndex})">Delete</button>
            </div>
        `;
    });

    showPagination(totalPages);
}

function showPagination(totalPages) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `
            <button class="${i === currentPage ? "active" : ""}"
                    onclick="goToPage(${i})">${i}</button>
        `;
    }
}

function goToPage(page) {
    currentPage = page;
    showItems();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function escapeHTML(text) {
    return text.replace(/[&<>"']/g, function(char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[char];
    });
}

document.getElementById("search").addEventListener("input", function() {
    currentPage = 1;
});

updateGenreFilter();
showItems();
