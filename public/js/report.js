// This function handles pagination for a specified table by showing a limited number of rows per page.
function paginateTable(tableId, paginationId, rowsPerPage = 5) {
    // Get the table and pagination elements by their IDs.
    const table = document.getElementById(tableId);
    const pagination = document.getElementById(paginationId);
    
    // Retrieve all rows from the table's tbody and calculate the total pages needed.
    const rows = Array.from(table.getElementsByTagName("tbody")[0].getElementsByTagName("tr"));
    const totalRows = rows.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    // Function to display only the rows for a specified page number.
    function displayPage(pageNumber) {
        rows.forEach((row, index) => {
            // Display rows that belong to the current page and hide others.
            row.style.display = (index >= (pageNumber - 1) * rowsPerPage && index < pageNumber * rowsPerPage) ? "" : "none";
        });
    }

    // Function to create pagination links dynamically based on the total number of pages.
    function createPaginationLinks() {
        pagination.innerHTML = ""; // Clear existing links if any.
        for (let i = 1; i <= totalPages; i++) {
            const link = document.createElement("a");
            link.href = "#"; // Prevent default navigation.
            link.innerText = i; // Set link text to the page number.
            link.classList.add("page-link"); // Add a class for styling.
            
            // Add a click event listener to update the table when a page is clicked.
            link.addEventListener("click", function(e) {
                e.preventDefault();
                displayPage(i); // Display the selected page.
                updateActiveLink(i); // Highlight the active link.
            });
            pagination.appendChild(link); // Add the link to the pagination container.
        }
    }

    // Function to update the active link's appearance based on the current page.
    function updateActiveLink(activePage) {
        const links = pagination.getElementsByClassName("page-link");
        Array.from(links).forEach((link, index) => {
            // Toggle the "active" class to highlight the link of the current page.
            link.classList.toggle("active", index + 1 === activePage);
        });
    }

    // Initialize the pagination by displaying the first page and creating the pagination links.
    displayPage(1); // Show the first page by default.
    createPaginationLinks(); // Create the pagination links based on the number of pages.
    updateActiveLink(1); // Highlight the first page link as active.
}

// When the document is fully loaded, initialize pagination for both tables.
document.addEventListener("DOMContentLoaded", () => {
    paginateTable("inputRequestsTable", "inputRequestsPagination"); // Initialize for the input requests table.
    paginateTable("recommendationsTable", "recommendationsPagination"); // Initialize for the recommendations table.
});
