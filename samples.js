//Showpage
// action="/auctions/<%=auction._id %>/bids" method="POST"
// <% for (let bid of auction.bids) { %> 
//     <div class="card mb-3">
//         <div class="card-body">
//           <h5 class="card-title"> <%=bid.bidder.username%></h5>
//           <!-- <h6 class="card-subtitle mb-2 text-muted">By: <%= review.author.username %></h6> -->
//           <p class="card-text">: <%=bid.body%></p>
//           <% if (currentUser &&  bid.bidder.equals(currentUser)) { %>
//               <form action="/auctions/<%=auction._id%>/bids/<%=bid._id%>?_method=DELETE" method="POST">
//                 <button class="btn btn-sm btn-danger">Delete</button>
//               </form>
//           <% } %>
//         </div>
//     </div> 
//   <% } %>