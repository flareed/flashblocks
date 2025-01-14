document.addEventListener("DOMContentLoaded", function ()
{
    const search = document.getElementById("search-input");
    const sort = document.getElementById("sort-select");
    const tableBody = document.getElementById("user-table-body");

    // Search functionality
    search.addEventListener("input", function ()
    {
        const searchTerm = search.value.toLowerCase();
        const rows = tableBody.querySelectorAll("tr");

        rows.forEach(row =>
        {
            const name = row.cells[0].textContent.toLowerCase();
            const email = row.cells[1].textContent.toLowerCase();
            row.style.display = name.includes(searchTerm) || email.includes(searchTerm) ? "" : "none";
        });
    });

    // Sort functionality
    sort.addEventListener("change", function ()
    {
        const [key, order] = sort.value.split("-");
        const rows = Array.from(tableBody.querySelectorAll("tr"));

        rows.sort((a, b) =>
        {
            const cellA = a.cells[key === "name" ? 0 : 1].textContent.toLowerCase();
            const cellB = b.cells[key === "name" ? 0 : 1].textContent.toLowerCase();

            if (cellA < cellB) return order === "asc" ? -1 : 1;
            if (cellA > cellB) return order === "asc" ? 1 : -1;
            return 0;
        });

        rows.forEach(row => tableBody.appendChild(row)); // Reorder rows in the table
    });
});