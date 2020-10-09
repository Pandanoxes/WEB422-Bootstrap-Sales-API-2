// When ready run the function and hide variable to be access outside of this file
$(() => {
  //Declare Empty array
  let saleData = [];

  //Set page and const perPage
  let page = 1;
  const perPage = 10;

  //Template for SaleTable
  const saleTableTemplate = _.template(`
    <% _.forEach(sales, function(sale) { %>
        <tr data-id=<%-sale._id%>>
            <td><%-sale.customer.email%></td>
            <td><%-sale.storeLocation%></td>
            <td><%-sale.items.length%></td>
            <td><%=moment.utc(sale.saleDate).local().format('LLLL')%></td>
        </tr>
    <% }); %>`);

  //Template for saleModelBody
  const saleModelBodyTemplate = _.template(`
    <h4>Customer</h4>
    <strong>email:</strong> <%=sale.customer.email%><br>
    <strong>age:</strong> <%=sale.customer.age%><br>
    <strong>satisfaction:</strong> <%=sale.customer.satisfaction%> / 5
    <br><br>
    <h4> Items: $<%=sale.total.toFixed(2)%> </h4>
    <table class="table">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Quantity</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        <% _.forEach(sale.items, function(item) { %> 
          <tr>
            <td><%- item.name%></td>
            <td><%- item.quantity%></td>
            <td>$<%- item.price%></td>
          </tr>
        <% }); %>
      </tbody>
    </table>`);

  //loadSaleData function
  function loadSaleData() {
    //make an Ajax call to get the data and when it done, display the table and current page
    $.ajax({
      method: "GET",
      url: `https://web422-sale-api.herokuapp.com/api/sales?page=${page}&perPage=${perPage}`,
    })
      .done((data) => {
        saleData = data;
        $("#sale-table tbody").html(saleTableTemplate({ sales: saleData }));
        $("#current-page").html(page);
      })
      .fail((err) => {
        console.log(err);
      });
  }
  loadSaleData();

  $("#sale-table tbody").on("click", "tr", function () {
    //When event is trigger the the data-id of the row
    //and find the object through the array using the id to compare.
    let clickedId = $(this).attr("data-id");
    let clickedSale = saleData.find((sale) => sale._id === clickedId);

    //Create the total of the items * quantity
    clickedSale.total = 0;

    clickedSale.items.forEach((item) => {
      clickedSale.total += item.price * item.quantity;
    });

    //Change the modal title and body then call it
    $("#sale-modal .modal-title").html(`Sale: ${clickedSale._id}`);
    $("#sale-modal .modal-body").html(
      saleModelBodyTemplate({ sale: clickedSale })
    );
    $("#sale-modal").modal();
  });

  //Select #previous-page and add click event
  //On click decreament page if not less than one then call loadSaleData function
  $("#previous-page").click(() => {
    if (page > 1) {
      page--;
      loadSaleData();
    }
  });

  //Select#next-page and add click event
  //On click increament by 1 page if not less than one then call loadSaleData function
  $("#next-page").click(() => {
    page++;
    loadSaleData();
  });
});
