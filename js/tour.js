// ---- EDIT TOUR DATES HERE ----
const TOUR_DATES = [
  {
    date:    "MAY 10",
    venue:   "NDA Comedy",
    city:    "Open Mic Night",
    link:    "https://ticketlink.com",
    soldOut: false,
  },
  {
    date:    "MAY 17",
    venue:   "TopCity Comedy",
    city:    "Contest Night",
    link:    "https://ticketlink.com",
    soldOut: false,
  },
  {
    date:    "MAY 24",
    venue:   "Cabaret Arts & Social Theatre",
    city:    "Special Show",
    link:    null,
    soldOut: true,
  },
  {
    date:    "JUN 07",
    venue:   "Big Nick Comedy Bar",
    city:    "Hosted Show",
    link:    "https://ticketlink.com",
    soldOut: false,
  },
];

function renderTourDates() {
  const list = document.getElementById("tour-list");
  if (!list) return;

  if (TOUR_DATES.length === 0) {
    list.innerHTML = '<div class="card tilt-left" style="padding:24px;opacity:1;"><p style="font-family:\'Permanent Marker\',cursive;">No upcoming shows — check back soon!</p></div>';
    return;
  }

  list.innerHTML = TOUR_DATES.map((show) => `
    <div class="tour-item">
      <span class="tour-date">${show.date}</span>
      <div>
        <div class="tour-venue">${show.venue}</div>
        <div class="tour-city">${show.city}</div>
      </div>
      ${
        show.soldOut
          ? '<span class="tour-sold-out">SOLD OUT</span>'
          : `<a href="${show.link}" target="_blank" rel="noopener" class="tour-ticket">TICKETS</a>`
      }
    </div>
  `).join("");
}

renderTourDates();
