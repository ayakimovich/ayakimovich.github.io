(function () {
  'use strict';

  // ── Helpers ─────────────────────────────────────────────────────────────────

  /** Parse a simple CSV with a header row. Handles quoted fields containing commas. */
  function parseCSV(text) {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return [];
    const headers = splitCSVRow(lines[0]);
    return lines.slice(1).map(line => {
      const vals = splitCSVRow(line);
      const obj = {};
      headers.forEach((h, i) => { obj[h.trim()] = (vals[i] || '').trim(); });
      return obj;
    });
  }

  /** Split one CSV row, respecting quoted fields. */
  function splitCSVRow(row) {
    const result = [];
    let cur = '', inQuote = false;
    for (let i = 0; i < row.length; i++) {
      const ch = row[i];
      if (ch === '"') { inQuote = !inQuote; }
      else if (ch === ',' && !inQuote) { result.push(cur); cur = ''; }
      else { cur += ch; }
    }
    result.push(cur);
    return result;
  }

  /** Format author string from "Last, First; Last2, First2;" format.
   *  → "Last, First, Last2, First2" or "Last, First, et al." if >2 authors */
  function formatAuthors(raw) {
    const parts = raw.split(';').map(s => s.trim()).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length <= 2) return parts.join(', ');
    return parts[0] + ', et al.';
  }

  /** Build a human-readable citation string matching the existing site style. */
  function formatCitation(row) {
    const authors = formatAuthors(row['Authors']);
    const title = row['Title'];
    const journal = row['Publication'];
    const vol = row['Volume'];
    const num = row['Number'];
    const pages = row['Pages'];
    const year = row['Year'];

    let venue = journal;
    if (vol) venue += ' ' + vol;
    if (num) venue += '.' + num;
    if (pages) venue += ': ' + pages;

    return `${authors}. "${title}." ${venue} (${year}).`;
  }

  /** Build a Google Scholar search URL for a title. */
  function scholarURL(title) {
    return 'https://scholar.google.com/scholar?q=' + encodeURIComponent(title);
  }

  /** Return true if the publication looks like a preprint (arXiv / bioRxiv). */
  function isPreprint(row) {
    const pub = (row['Publication'] || '').toLowerCase();
    return pub.includes('arxiv') || pub.includes('biorxiv');
  }

  /** Normalise a title for deduplication comparison. */
  function normaliseTitle(title) {
    return title.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  // ── Main ────────────────────────────────────────────────────────────────────

  function renderPublications(rows) {
    // Filter: only papers strictly after 2021
    const recent = rows.filter(r => parseInt(r['Year'], 10) > 2021);

    // Separate preprints from peer-reviewed
    const peerReviewed = recent.filter(r => !isPreprint(r));
    const preprints = recent.filter(r => isPreprint(r));

    // Build set of peer-reviewed titles for deduplication
    const peerTitles = new Set(peerReviewed.map(r => normaliseTitle(r['Title'])));

    // Suppress preprints that have a matching peer-reviewed version
    const uniquePreprints = preprints.filter(
      r => !peerTitles.has(normaliseTitle(r['Title']))
    );

    // Sort both descending by year
    const byYearDesc = (a, b) => parseInt(b['Year'], 10) - parseInt(a['Year'], 10);
    peerReviewed.sort(byYearDesc);
    uniquePreprints.sort(byYearDesc);

    // Render helper → list of <a> elements
    function toHTML(list) {
      return list.map(row => {
        const citation = formatCitation(row);
        const url = scholarURL(row['Title']);
        return `<a href='${url}'>${citation}</a></br>`;
      }).join('\n\n');
    }

    const preprintsEl = document.getElementById('preprints-list');
    const papersEl = document.getElementById('papers-list');

    if (preprintsEl) {
      preprintsEl.innerHTML = uniquePreprints.length
        ? toHTML(uniquePreprints)
        : '<em>No preprints to display.</em>';
    }
    if (papersEl) {
      papersEl.innerHTML = peerReviewed.length
        ? toHTML(peerReviewed)
        : '<em>No papers to display.</em>';
    }
  }

  // Resolve the CSV path relative to the site root (handles GitHub Pages subdirectory)
  const csvPath = (function () {
    const scripts = document.querySelectorAll('script[src]');
    for (const s of scripts) {
      if (s.src && s.src.includes('publications.js')) {
        return s.src.replace('publications.js', 'citations.csv');
      }
    }
    return 'bibliography/citations.csv';
  })();

  fetch(csvPath)
    .then(r => { if (!r.ok) throw new Error('CSV fetch failed: ' + r.status); return r.text(); })
    .then(text => renderPublications(parseCSV(text)))
    .catch(err => {
      console.error('[publications.js]', err);
      ['preprints-list', 'papers-list'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '<em>Could not load publications.</em>';
      });
    });
})();
