/* Boekstuk: producten en winkelmand.
   Prijzen staan in eurocenten om afrondingsfouten te voorkomen. */

const PRODUCTS = [
  {
    id: "startup-model",
    name: "Financieel model voor startups",
    description: "Drie jaar vooruitkijken: omzet, kosten, personeel en financiering in één model.",
    includes: ["Winst- en verliesrekening, balans en kasstroom", "Drie scenario's naast elkaar", "Runway en break-even-punt"],
    price: 4900,
  },
  {
    id: "cashflow-13-weken",
    name: "Cashflow-forecast 13 weken",
    description: "De standaard voor treasury: zie week voor week wanneer je liquiditeit krap wordt.",
    includes: ["Ontvangsten en betalingen per week", "Minimaal saldo met waarschuwing", "Vergelijking met werkelijk verloop"],
    price: 3900,
  },
  {
    id: "begroting-realisatie",
    name: "Begroting versus realisatie",
    description: "Leg je jaarbegroting naast de werkelijke cijfers en zie direct waar je afwijkt.",
    includes: ["Afwijkingen in euro's en procenten", "Cumulatief en per maand", "Overzicht voor de directie"],
    price: 3400,
  },
  {
    id: "investeringsbeoordeling",
    name: "Investeringsbeoordeling",
    description: "Weeg een investering af met netto contante waarde, rendement en terugverdientijd.",
    includes: ["Netto contante waarde en IRR", "Gevoeligheidsanalyse", "Vergelijking van maximaal vijf opties"],
    price: 2900,
  },
  {
    id: "maandrapportage",
    name: "Zakelijke maandrapportage",
    description: "Een vaste maandrapportage voor je bedrijf, zonder elke maand opnieuw opmaken.",
    includes: ["Kerncijfers en trendgrafieken", "Resultaat per afdeling of product", "Printklare opmaak"],
    price: 4400,
  },
  {
    id: "debiteurenbewaking",
    name: "Debiteurenbewaking",
    description: "Houd openstaande facturen bij en zie welke klanten te laat betalen.",
    includes: ["Ouderdomsanalyse van facturen", "Automatische aanmaningslijst", "Gemiddelde betaaltermijn per klant"],
    price: 2400,
  },
];

const STORAGE_KEY = "boekstuk-cart";
const euro = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" });
const formatPrice = (cents) => euro.format(cents / 100);

/* ---------- Winkelmand-staat ---------- */
let cart = loadCart();

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    // Houd alleen bekende producten met een geldig aantal over.
    const clean = {};
    for (const p of PRODUCTS) {
      const qty = Number(parsed[p.id]);
      if (Number.isInteger(qty) && qty > 0) clean[p.id] = Math.min(qty, 99);
    }
    return clean;
  } catch (err) {
    return {};
  }
}

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (err) {
    /* Opslaan mislukt (bijvoorbeeld privémodus): de mand werkt dan alleen tijdens dit bezoek. */
  }
}

function addToCart(id) {
  cart[id] = Math.min((cart[id] || 0) + 1, 99);
  saveCart();
  renderCart();
}

function changeQty(id, delta) {
  const next = (cart[id] || 0) + delta;
  if (next <= 0) delete cart[id];
  else cart[id] = Math.min(next, 99);
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  delete cart[id];
  saveCart();
  renderCart();
}

/* ---------- Producten tonen ---------- */
const grid = document.getElementById("product-grid");

function renderProducts() {
  grid.innerHTML = "";
  for (const p of PRODUCTS) {
    const article = document.createElement("article");
    article.className = "product";

    const title = document.createElement("h3");
    title.textContent = p.name;

    const desc = document.createElement("p");
    desc.textContent = p.description;

    const list = document.createElement("ul");
    list.className = "includes";
    for (const item of p.includes) {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    }

    const foot = document.createElement("div");
    foot.className = "product-foot";

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = formatPrice(p.price);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-primary";
    button.textContent = "In winkelmand";
    button.setAttribute("aria-label", `${p.name} in winkelmand leggen`);
    button.addEventListener("click", () => {
      addToCart(p.id);
      button.classList.add("added");
      button.textContent = "Toegevoegd";
      setTimeout(() => {
        button.classList.remove("added");
        button.textContent = "In winkelmand";
      }, 1200);
    });

    foot.append(price, button);
    article.append(title, desc, list, foot);
    grid.appendChild(article);
  }
}

/* ---------- Winkelmand tonen ---------- */
const cartDialog = document.getElementById("cart");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const checkoutButton = document.getElementById("checkout");
const checkoutStatus = document.getElementById("checkout-status");

function renderCart() {
  const entries = PRODUCTS.filter((p) => cart[p.id]);
  const count = entries.reduce((sum, p) => sum + cart[p.id], 0);
  const total = entries.reduce((sum, p) => sum + cart[p.id] * p.price, 0);

  cartCount.textContent = String(count);
  cartCount.classList.toggle("has-items", count > 0);
  cartTotal.textContent = formatPrice(total);
  checkoutButton.disabled = count === 0;
  checkoutStatus.textContent = "";
  cartItems.innerHTML = "";

  if (entries.length === 0) {
    const empty = document.createElement("p");
    empty.className = "cart-empty";
    empty.textContent = "Je winkelmand is leeg. Kies een sjabloon om te beginnen.";
    cartItems.appendChild(empty);
    return;
  }

  for (const p of entries) {
    const qty = cart[p.id];
    const line = document.createElement("div");
    line.className = "cart-line";

    const top = document.createElement("div");
    top.className = "cart-line-top";
    const name = document.createElement("span");
    name.textContent = p.name;
    const sub = document.createElement("span");
    sub.textContent = formatPrice(p.price * qty);
    top.append(name, sub);

    const controls = document.createElement("div");
    controls.className = "cart-line-controls";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.className = "qty-button";
    minus.textContent = "\u2212";
    minus.setAttribute("aria-label", `Minder: ${p.name}`);
    minus.addEventListener("click", () => changeQty(p.id, -1));

    const qtyEl = document.createElement("span");
    qtyEl.className = "qty";
    qtyEl.textContent = String(qty);

    const plus = document.createElement("button");
    plus.type = "button";
    plus.className = "qty-button";
    plus.textContent = "+";
    plus.setAttribute("aria-label", `Meer: ${p.name}`);
    plus.addEventListener("click", () => changeQty(p.id, 1));

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-button";
    remove.textContent = "Verwijderen";
    remove.setAttribute("aria-label", `${p.name} verwijderen`);
    remove.addEventListener("click", () => removeFromCart(p.id));

    controls.append(minus, qtyEl, plus, remove);
    line.append(top, controls);
    cartItems.appendChild(line);
  }
}

/* ---------- Dialog en knoppen ---------- */
document.getElementById("open-cart").addEventListener("click", () => {
  if (typeof cartDialog.showModal === "function") cartDialog.showModal();
});
document.getElementById("close-cart").addEventListener("click", () => cartDialog.close());
// Klik naast de mand sluit hem.
cartDialog.addEventListener("click", (event) => {
  if (event.target === cartDialog) cartDialog.close();
});

checkoutButton.addEventListener("click", () => {
  checkoutStatus.textContent = "Dit is een testproject: er is geen betaalprovider gekoppeld en er is niets afgerekend.";
});

document.getElementById("download-free").addEventListener("click", () => {
  document.getElementById("download-status").textContent =
    "Download gestart. Open het bestand in Excel en begin op het tabblad Instructies.";
});

renderProducts();
renderCart();
