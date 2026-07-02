import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = {
  footer: {
    institute_name: { uz: "Urganch Davlat\nPedagogika Instituti", ru: "Ургенчский Государственный\nПедагогический Институт", en: "Urgench State\nPedagogical Institute" },
    address: { uz: "Urganch sh. Gurlan ko'chasi 1A-uy", ru: "г. Ургенч, ул. Гурлан, дом 1А", en: "Urgench city, Gurlan street, 1A" }
  }
};

function patchFile(locale) {
  const file = path.join(__dirname, 'src/locales', locale, 'translation.json');
  const current = JSON.parse(fs.readFileSync(file, 'utf8'));
  
  if (!current.footer) current.footer = {};
  
  for (const [key, langs] of Object.entries(data.footer)) {
    current.footer[key] = langs[locale];
  }
  
  fs.writeFileSync(file, JSON.stringify(current, null, 2));
}

patchFile('uz');
patchFile('ru');
patchFile('en');
console.log('Translations added successfully.');
