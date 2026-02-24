function searchProduct(){
    const query = document.getElementById("searchInput").value;
    if(query.trim() !== ""){
        window.location.href = "search.html?query=" + query;
    }
}