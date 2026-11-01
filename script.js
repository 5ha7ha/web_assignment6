$(document).ready(function () {

  buildParty();  // load page

  $("#case-buttons .case-btn").on("click", function () {
    const $found = runCase($(this));   // rebuild + run the case chain
    showResult($found);                // highlight, jump, count and names
  });

});