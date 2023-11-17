class Produkt {
    constructor(id, nazwa, model, rokProdukcji, cena, zużycieEnergii) {
      this.id = id;
      this.nazwa = nazwa;
      this.model = model;
      this.rokProdukcji = rokProdukcji;
      this.cena = cena;
      this.zużycieEnergii = zużycieEnergii;
    }
  
    koszt() {
      return this.cena;
    }
  
    kosztEnergii(cenaEnergii) {
      return this.zużycieEnergii * cenaEnergii;
    }
  
    wiekProduktu() {
      const aktualnaData = new Date();
      return aktualnaData.getFullYear() - this.rokProdukcji;
    }
  
    wiekProduktuLata() {
      const wiek = this.wiekProduktu();
      return `${wiek} ${wiek === 1 ? 'rok' : 'lata'}`;
    }
  }
  
  class ListaTowarow {
    constructor() {
      this.towary = [];
    }
  
    wypiszProdukt(idProduktu) {
      const produkt = this.towary.find((p) => p.id === idProduktu);
      if (produkt) {
        return JSON.stringify(produkt, null, 2);
      } else {
        return 'Produkt o podanym ID nie istnieje.';
      }
    }
  
    wypiszWszystkieProdukty() {
      return JSON.stringify(this.towary, null, 2);
    }
  
    dodajProdukt(produkt) {
      if (this.towary.some((p) => p.id === produkt.id)) {
        throw new Error('Produkt o podanym ID już istnieje.');
      }
      this.towary.push(produkt);
    }
  
    zmienProdukt(idProduktu, nowyProdukt) {
      const indeks = this.towary.findIndex((p) => p.id === idProduktu);
      if (indeks !== -1) {
        this.towary[indeks] = { ...nowyProdukt, id: idProduktu };
      }
    }
  }
  
  class Magazyn extends ListaTowarow {
    dodajProdukt(produkt, ilosc) {
      super.dodajProdukt(produkt);
  
      if (!this.stanMagazynowy) {
        this.stanMagazynowy = {};
      }
  
      if (this.stanMagazynowy[produkt.id]) {
        this.stanMagazynowy[produkt.id] += ilosc;
      } else {
        this.stanMagazynowy[produkt.id] = ilosc;
      }
    }
  
    zabierzProdukt(idProduktu, ilosc) {
      if (this.stanMagazynowy[idProduktu] >= ilosc) {
        this.stanMagazynowy[idProduktu] -= ilosc;
        const produkt = { ...this.towary.find((p) => p.id === idProduktu) };
        return produkt;
      } else {
        throw new Error('Brak wystarczającej ilości produktu w magazynie.');
      }
    }
  }
  
  class Sklep extends ListaTowarow {
    dodajProdukt(nazwa, model, cena, zużycieEnergii) {
      const idProduktu = this.towary.length + 1;
      const rokProdukcji = new Date().getFullYear();
      const nowyProdukt = new Produkt(
        idProduktu,
        nazwa,
        model,
        rokProdukcji,
        cena,
        zużycieEnergii
      );
      super.dodajProdukt(nowyProdukt);
    }
  
    dodajProduktZId(idProduktu, nazwa, model, cena, zużycieEnergii) {
      const rokProdukcji = new Date().getFullYear();
      const nowyProdukt = new Produkt(
        idProduktu,
        nazwa,
        model,
        rokProdukcji,
        cena,
        zużycieEnergii
      );
      super.dodajProdukt(nowyProdukt);
    }
  
    zlozZamowienie(idProduktu, ilosc, magazyn) {
      try {
        const produkt = magazyn.zabierzProdukt(idProduktu, ilosc);
        this.dodajProduktZId(
          produkt.id,
          produkt.nazwa,
          produkt.model,
          produkt.cena,
          produkt.zużycieEnergii
        );
        console.log(`Zamówienie zrealizowane: ${ilosc} szt. ${produkt.nazwa}`);
      } catch (error) {
        console.error(error.message);
      }
    }
  }
  
  const magazyn = new Magazyn();
  const sklep = new Sklep();
  
  const produkt1 = new Produkt(1, 'Laptop', 'Model X', 2022, 2000, 0.1);
  const produkt2 = new Produkt(2, 'Smartfon', 'Model Y', 2021, 800, 0.05);
  
  magazyn.dodajProdukt(produkt1, 10);
  magazyn.dodajProdukt(produkt2, 20);
  
  console.log('Magazyn:');
  console.log(magazyn.wypiszWszystkieProdukty());
  
  console.log('\nSklep:');
  console.log(sklep.wypiszWszystkieProdukty());
  
  sklep.zlozZamowienie(1, 5, magazyn);
  
  console.log('\nMagazyn po złożeniu zamówienia:');
  console.log(magazyn.wypiszWszystkieProdukty());
  
  console.log('\nSklep po złożeniu zamówienia:');
  console.log(sklep.wypiszWszystkieProdukty());
  