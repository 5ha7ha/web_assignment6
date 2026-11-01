// SHARED CODE: used by Task 1 and Task 2 (data, page builder, cases)

const AVATAR_STYLE = "micah";
const party = [
  // ==================== FLOOR 2 ====================
  {
    room: "Balcony",
    floor: 2,
    guests: [
      {
        name: "Aigerim",
        color: "green",     // Green outline/clothes
        time: "20:45",
        aitu: true,         // Has AITU cap/badge
        things: ["cup", "crumbs"] // ☕ (cup), 🧁 (crumbs crumbs)
      },
      {
        name: "Aliya",
        color: "black",
        time: "21:15",
        aitu: false,
        things: ["phone", "cup"] // 📱, ☕
      },
      {
        name: "Madina",
        color: "green",
        time: "22:10",
        aitu: false,
        things: ["phone", "bag", "crumbs"] // 📱, 🛍️, 🧁
      },
      {
        name: "Ivan",
        color: "black",     // Dark grey/black outline
        time: "20:10",
        aitu: true,
        things: ["cup"] // ☕
      }
    ]
  },
  {
    room: "Hall",
    floor: 2,
    guests: [
      {
        name: "Arman",
        color: "yellow",
        time: "20:35",
        aitu: false,
        things: ["bag", "glasses"] // 🛍️, 👓
      },
      {
        name: "Sophia",
        color: "purple",
        time: "21:20",
        aitu: true,
        things: ["phone"] // 📱
      },
      {
        name: "Dias",
        color: "green",
        time: "19:45",
        aitu: true,
        things: [] // None visible
      },
      {
        name: "Bekzat",
        color: "purple",
        time: "20:55",
        aitu: false,
        things: ["bag", "cup", "crumbs"] // 🛍️, ☕, 🧁
      },
      {
        name: "Aruzhan",
        color: "blue",
        time: "21:50",
        aitu: true,
        things: ["phone"] // 📱
      },
      {
        name: "Saule",
        color: "green",
        time: "21:25",
        aitu: false,
        things: ["glasses"] // 👓
      }
    ]
  },

  // ==================== FLOOR 1 ====================
  {
    room: "Kitchen",
    floor: 1,
    guests: [
      {
        name: "Nurlan",
        color: "red",
        time: "19:40",
        aitu: true,
        things: ["phone", "cup"] // 📱, ☕
      },
      {
        name: "Emma",
        color: "black",
        time: "20:15",
        aitu: false,
        things: ["bag"] // 🛍️
      },
      {
        name: "Timur",
        color: "green",
        time: "21:05",
        aitu: true,
        things: ["phone", "bag", "crumbs"] // 📱, 🛍️, 🧁
      },
      {
        name: "Sergey",
        color: "yellow",
        time: "20:50",
        aitu: false,
        things: [] // None visible
      },
      {
        name: "Yerlan",
        color: "red",
        time: "21:40",
        aitu: true,
        things: ["glasses", "phone"] // 👓, 📱
      },
      {
        name: "Kamila",
        color: "green",
        time: "20:05",
        aitu: false,
        things: ["cup"] // ☕
      }
    ]
  },
  {
    room: "Living room",
    floor: 1,
    guests: [
      {
        name: "Daniel",
        color: "blue",
        time: "19:55",
        aitu: true,
        things: ["glasses"] // 👓
      },
      {
        name: "Zarina",
        color: "green",
        time: "21:10",
        aitu: false,
        things: ["bag", "phone", "crumbs"] // 🛍️, 📱, 🧁
      },
      {
        name: "Natasha",
        color: "yellow",
        time: "20:30",
        aitu: true,
        things: [] // None visible
      },
      {
        name: "Askar",
        color: "black",
        time: "21:00",
        aitu: true,
        things: ["phone"] // 📱
      },
      {
        name: "Inkar",
        color: "purple",
        time: "20:20",
        aitu: false,
        things: ["bag"] // 🛍️
      }
    ]
  }
];


function buildParty() {
  const $house = $('#house'); 
  $house.empty(); //runs before every case

  [2, 1].forEach(function (floorNum) {
    const $floor = $("<div>", {class: "floor", "data-floor": floorNum})
      .append($("<div>", {class: "floor-label", text: "floor  " + floorNum}));
    const $rooms = $("<div>", {class:"rooms"}).appendTo($floor);

    party.filter(r => r.floor === floorNum).forEach(function(room){
      //create .room and .room-head
      const $room = $("<div>", {class: "room", "data-room": room.room.toLowerCase().replace(" ", "-"), "data-floor": floorNum})
        .appendTo($rooms);

      $("<div>", {class:"room-head"})
        .append($("<div>", {class:"room-name", text: room.room}))
        .appendTo($room);

      const $guests = $("<div>", {class: "room-guests"}).appendTo($room);

      room.guests.forEach(function (g){
        // create the .guest card and append it to $guests
        createGuest(g).appendTo($guests);
      });
    });
    $house.append($floor);
  }); 
}
//creat guest card sepratelly
function createGuest(g) {
  const $guest = $("<div>", {
    class: "guest color-" + g.color + (g.aitu ? " aitu" : ""),
    "data-name": g.name,
    "data-color": g.color,
    "data-time": g.time,
    "data-things": g.things.join(" ")
  });

  const $avatarWrap = $("<div>", { class: "avatar-wrap" })
    .append($("<img>", {
      class: "avatar",
      src: "https://api.dicebear.com/9.x/" + AVATAR_STYLE + "/svg?seed=" + g.name + 19,
      alt: g.name
    }));

  if (g.aitu) {
    $avatarWrap.append($("<div>", { class: "aitu-badge" }));
  }

  const $things = $("<div>", { class: "things" });
  g.things.forEach(function (t) {
    $things.append($("<span>", { class: "thing thing-" + t }));
  });

  return $guest
    .append($avatarWrap)
    .append($("<div>", { class: "guest-name", text: g.name }))
    .append($("<div>", { class: "guest-time", text: g.time }))
    .append($things);
}
//show the result of every case
function showResult($found) { 
  $found.addClass("found");

  // guests who been found jump once
  $found.filter(".guest")
    .animate({ top: "-14px" }, 150)
    .animate({ top: "0px" }, 150);

  $("#result-count").text($found.length + " found");

  const $names = $("#result-names").empty();
  $found.each(function () {
    const name = $(this).hasClass("room")
      ? $(this).find(".room-name").text()
      : $(this).attr("data-name");
    $("<span>", { class: "chip", text: name }).appendTo($names);
  });
}

// one jQuery chain per case; each returns the found guests (or rooms)
const cases = {
  1: function () {
    return $(".room[data-room='hall']").find(".guest");
  },
  2: function () { 
    return $(".room").find(".guest.color-yellow, .guest.color-purple"); 
  },
  3: function () { 
    return $(".floor[data-floor='2']").find(".guest.aitu"); 
  },
  4: function () {
    return $(".guest").has(".thing-glasses, .thing-bag");
  },
  5: function () {
    return $(".guest").not(":has(.thing)");
  },
  6: function () {
    return $(".guest:has(.thing-phone):not(:has(.thing-bag))");
  },
  7: function () {
   return $(".guest").filter(function () {
      const t = $(this).attr("data-time");
      return t >= "20:30" && t <= "21:00";
    });
  },
  8: function () {
    return $(".guest").filter(function () {
      return $(this).attr("data-time") > "21:00";
    }).not(".aitu");
  },
  9: function () {
    const $askar = $(".guest[data-name='Askar']");
    return $askar.prev().add($askar.next());
  },
  10: function () {
    return $(".guest:last-child");
  },
  11: function () {
    return $(".guest:nth-child(3)");
  },
  12: function () {
    return $(".guest[data-name='Timur']").nextAll();
  },
  13: function () {
    return $(".room").find(".guest.color-black").prev(); 
  },
  14: function () {
    return $(".guest[data-name='Aruzhan']").closest(".room");
  },
  15: function () {
    return $(".room").filter(function () {
      return $(this).find(".guest").length < 6;
    });
  },
  16: function () {
    return $(".room").has(".thing-cup").not(":has(.thing-glasses)");
  },
  17: function () {
    let $result = $();
    $(".room").each(function () {
      let $earliest = null;
      $(this).find(".guest").each(function () {
        if ($earliest === null || $(this).attr("data-time") < $earliest.attr("data-time")) {
          $earliest = $(this);
        }
      });
      $result = $result.add($earliest);
    });
    return $result;
  },
  18: function () {
    const $miras = createGuest({
      name: "Miras", color: "blue", time: "21:20", aitu: true, things: ["phone"]
    }).hide();                                
    $miras.insertAfter(".guest[data-name='Askar']").fadeIn(1000);
    return $miras;
  },
  19: function () {
    const $natasha = $(".guest[data-name='Natasha']");
    $natasha.fadeOut(1000, function () { $(this).remove(); });
    return $natasha;
  },
  20: function () {
    return $(".floor[data-floor='1']").find(".guest")
    .has(".thing-crumbs")
    .not(":has(.thing-cup)")
    .filter(function () {
      const t = $(this).attr("data-time");
      return t > "21:00" && t < "21:30";
    })
    .filter(function () {
      return $(this).prev(".aitu").length > 0 || $(this).next(".aitu").length > 0;
    });
    }
};

// runs one case: rebuild the page, mark the button, set the title, return the found set
function runCase($btn) {
  const caseNum = Number($btn.attr("data-case"));

  buildParty();                              // fresh page before every case
  $(".case-btn").removeClass("active");      // wipe the previous active button
  $btn.addClass("active");                   // the button just clicked
  $("#result-title").text("Case " + caseNum + ": " + $btn.attr("title"));

  return cases[caseNum]();                   // run that case's chain
}