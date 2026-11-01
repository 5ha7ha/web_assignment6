const thingLabels = { phone: "a phone", glasses: "glasses", bag: "a bag", cup: "a cup", crumbs: "cake crumbs" };
let openCardState = null;   // the one open card: { $card, $guest, name, from, size }
let activeMoves = [];       // moves that are flying right now

// put a "Sort by time" button in every room header (call after every buildParty)
function addSortButtons() {
  $(".room-head").each(function () {
    $("<button>", { class: "sort-btn", text: "Sort by time" }).appendTo(this);
  });
}

function spotlight($found) {
  // cases 14-16 find rooms: the guests inside those rooms stay bright
  const $bright = $found.first().hasClass("room") ? $found.find(".guest") : $found;

  $(".guest").not($bright).stop(true, true).fadeTo(300, 0.2);
}
//---------guest card -------
// the lines of information shown on the card
function guestInfo($guest) {
  const things = ($guest.attr("data-things") || "").split(" ").filter(Boolean)
    .map(function (t) { return thingLabels[t]; });

  let hasText = "Came with nothing";
  if (things.length === 1) hasText = "Has " + things[0];
  if (things.length > 1) hasText = "Has " + things.slice(0, -1).join(", ") + " and " + things[things.length - 1];

  return [
    "Came at " + $guest.attr("data-time"),
    $guest.hasClass("aitu") ? "AITU student" : "Not an AITU student",
    "Wears " + $guest.attr("data-color"),
    hasText,
    "Stands in the " + $guest.closest(".room").find(".room-name").text().toLowerCase()
  ];
}

function openCard($guest) {
  closeCard();                                   // only one card can be open

  const $wrap = $guest.find(".avatar-wrap");
  const from  = $wrap.offset();                  // where the photo is on the page
  const size  = $wrap.outerWidth();              // the photo is a circle: width = height

  const $card = $("<div>", { class: "guest-popup color-" + $guest.attr("data-color") })
    .append($("<div>", { class: "popup-head" })
      .append($("<img>", { class: "popup-avatar", src: $guest.find(".avatar").attr("src") }))
      .append($("<h3>", { class: "popup-title", text: $guest.attr("data-name") })));

  const $list = $("<ul>", { class: "popup-info" }).appendTo($card);
  guestInfo($guest).forEach(function (line) {
    $("<li>", { text: line }).appendTo($list);
  });

   // one button for every other room: "Move to the hall"
  const here = $guest.closest(".room").find(".room-name").text();
  const $moves = $("<div>", { class: "move-buttons" }).appendTo($card);
  party.forEach(function (r) {
    if (r.room !== here) {
      $("<button>", { class: "move-btn", "data-to": r.room, text: "Move to the " + r.room.toLowerCase() })
        .appendTo($moves);
    }
  });

  // 1) measure the full height (hidden), 2) put the card on the photo, 3) grow it
  $card.css({ display: "block", visibility: "hidden", width: 260, height: "auto" })
    .appendTo("#card-layer");
  const fullHeight = $card.outerHeight();

  const left = Math.max(10, Math.min(from.left + size / 2 - 130, $(window).width() - 270));
  const top  = Math.max(10, from.top - 10);

  $card.css({ visibility: "visible", left: from.left, top: from.top, width: size, height: size });
  $card.animate({ left: left, top: top, width: 260, height: fullHeight }, 400);

  openCardState = { $card: $card, $guest: $guest, name: $guest.attr("data-name"), from: from, size: size };
}

function closeCard() {
  if (!openCardState) return;
  const s = openCardState;
  openCardState = null;     // no open card from this moment

  s.$card.stop(true).animate( // stop(true) = also works in the middle of growing
    { left: s.from.left, top: s.from.top, width: s.size, height: s.size },
    300,
    function () { $(this).remove(); }
  );
}

// move guest to another room
function moveGuest($guest, toName) {
  finishMoves();                                 // a flight that is still running ends first
 
  const name     = $guest.attr("data-name");
  const fromName = $guest.closest(".room").find(".room-name").text();
  const $newList = $(".room").filter(function () {
    return $(this).find(".room-name").text() === toName;
  }).find(".room-guests");
 
  // 1) change the array, so the cases from Task 1 find the guest in the new room
  const fromGuests = party.find(function (r) { return r.room === fromName; }).guests;
  const toGuests   = party.find(function (r) { return r.room === toName; }).guests;
  toGuests.push(fromGuests.splice(fromGuests.findIndex(function (g) { return g.name === name; }), 1)[0]);
 
  // 2) a copy of the card flies across the house, starting exactly where the guest stands
  const from   = $guest.offset();
  const totalW = $guest.outerWidth();            // width with padding
  const $ghost = $guest.clone().addClass("guest-ghost").css({
    position: "absolute", left: from.left, top: from.top, width: $guest.width(),
    margin: 0, pointerEvents: "none"
  }).appendTo("#card-layer");
 
  // 3) an empty place stays in the old room and closes slowly
  const gap = parseFloat($newList.css("column-gap")) || 0;
  const $gap = $("<div>", { class: "guest-gap" })
    .css({ flex: "none", width: totalW, height: 1 })
    .insertBefore($guest);
 
  // 4) the real card goes (invisible) to the end of the new room, and its place opens slowly
  $guest.stop("sort", true).css("left", 0).appendTo($newList);
  const to    = $guest.offset();                 // where it will stand at the end
  const newW  = $guest.width();                  // its width at the end
  const padL  = parseFloat($guest.css("paddingLeft"));
  const padR  = parseFloat($guest.css("paddingRight"));
  $guest.css({ visibility: "hidden", flex: "none", width: 0, paddingLeft: 0, paddingRight: 0, marginLeft: -gap });
 
  // 5) the three animations run together
  const time = 800;
  $ghost.animate({ left: to.left, top: to.top, width: newW }, time);
  $gap.animate({ width: 0, marginLeft: -gap }, time);
  $guest.animate({ width: newW, paddingLeft: padL, paddingRight: padR, marginLeft: 0 }, time);
 
  // 6) at the end: remove the copy and the gap, show the real card
  const move = { $ghost: $ghost, $gap: $gap, $guest: $guest, done: false };
  move.end = function () {
    if (move.done) return;                       // can be called twice, but works once
    move.done = true;
    move.$ghost.remove();
    move.$gap.remove();
    move.$guest.css({ visibility: "", flex: "", width: "", paddingLeft: "", paddingRight: "", marginLeft: "" });
    activeMoves = activeMoves.filter(function (m) { return m !== move; });
  };
  activeMoves.push(move);
  $ghost.add($gap).add($guest).promise().done(move.end);
}
 
// jump all running flights to their end (used before a new move and before a new case)
function finishMoves() {
  activeMoves.slice().forEach(function (m) {
    m.$ghost.add(m.$gap).add(m.$guest).finish();
    m.end();
  });
}
 
//Sort a room by arrival time
function sortRoom($room) {
  const $list   = $room.find(".room-guests");
  const $guests = $list.children(".guest");
  const roomName = $room.find(".room-name").text();
  const picture  = party.find(function (r) { return r.room === roomName; }).guests
    .map(function (g) { return g.name; });         // the order from the array = the picture
 
  function names(els) { return els.map(function (e) { return $(e).attr("data-name"); }).join(); }
  function rank(el)   { const i = picture.indexOf($(el).attr("data-name")); return i < 0 ? 999 : i; }
 
  const byTime = $guests.toArray().sort(function (a, b) {
    return $(a).attr("data-time") < $(b).attr("data-time") ? -1 : 1;
  });
 
  // already sorted by time? then go back to the picture order
  const sortedNow = names($guests.toArray()) === names(byTime);
  const newOrder  = sortedNow
    ? $guests.toArray().sort(function (a, b) { return rank(a) - rank(b); })
    : byTime;
 
  // where every card is right now (also when it is in the middle of a slide)
  const before = $guests.toArray().map(function (el) { return $(el).offset().left; });
 
  // change the real order at once ...
  $guests.stop("sort", true).css("left", 0);
  newOrder.forEach(function (el) { $list.append(el); });
 
  // ... and let every card slide from its old place to the new one
  $guests.each(function (i) {
    const shift = before[i] - $(this).offset().left;
    $(this).css("left", shift)
      .animate({ left: 0 }, { duration: 700, queue: "sort" })
      .dequeue("sort");
  });
}

$(document).ready(function () {
    const $clearBtn  = $("#clear-btn");      

    buildParty();  // load page
    addSortButtons();

    $("#case-buttons .case-btn").on("click", function () {
        finishMoves();                        // end flights before the page is rebuilt
        closeCard();
        const $found = runCase($(this));   // rebuild + run the case chain
        addSortButtons();  // the rebuild removed the old buttons
        showResult($found);   // highlight, jump, count and names
        spotlight($found);
    });

    //clearing
    $clearBtn.on("click", function () {
        $(".guest").finish().fadeTo(300, 1);//bright again (finish ends a jump that is still running) 

        $(".found").removeClass("found");              // remove the yellow highlight
        $(".case-btn").removeClass("active");
        $("#result-title").text("Result");
        $("#result-count").text("Click a case to start the investigation.");
        $("#result-names").empty();
    });


    // click on a guest: open (or close) the card
    $("#house").on("click", ".guest", function (e) {
        e.stopPropagation();     // so this click does not reach the document handler below                     
        const name = $(this).attr("data-name");
        if (openCardState && openCardState.name === name) closeCard(); else openCard($(this));
    });
    // click outside the card or Esc: close it
    $(document).on("click", function (e) {
        if (!$(e.target).closest(".guest-popup").length) closeCard();   // click outside the card
    });

    $(document).on("keydown", function (e) {
        if (e.key === "Escape") closeCard();
    });
    
    // "Move to the ..." button on the card
  $("#card-layer").on("click", ".move-btn", function () {
    if (!openCardState) return;           // the card is already closing: ignore a second click
    const guest = openCardState.$guest;
    closeCard();
    moveGuest(guest, $(this).attr("data-to"));
  });
 
  // "Sort by time" button of a room
  $("#house").on("click", ".sort-btn", function () {
    sortRoom($(this).closest(".room"));
  });

});