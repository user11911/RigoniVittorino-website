---
title: "ESEMPIO — non pubblicare"
date: 2026-01-01
excerpt: "Testo breve mostrato nell'anteprima della card (facoltativo)."
image: "/wp-content/uploads/esempio.jpg"
draft: true
---

Questo file mostra come creare un nuovo articolo News.

Per pubblicare un articolo reale:

1. Crea un nuovo file `.md` in questa cartella (`src/content/news/`), ad esempio
   `2026-06-15-titolo-articolo.md`.
2. Copia il blocco di intestazione (tra le righe `---`) da questo file.
3. Compila `title` (obbligatorio) e `date` (obbligatorio, formato AAAA-MM-GG).
4. `excerpt` e `image` sono facoltativi.
5. Imposta `draft: false` (o rimuovi la riga) quando l'articolo è pronto per essere
   pubblicato — finché resta `true`, l'articolo non compare sul sito.
6. Scrivi il testo dell'articolo qui sotto la riga `---` finale.

Questo file di esempio ha `draft: true` e non verrà mai mostrato pubblicamente su
`/it/news/`.
