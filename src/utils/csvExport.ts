import { Club, TechnoEvent } from '../types/index.ts';

/**
 * Escapes a cell value according to RFC 4180 rules
 */
function escapeCSVCell(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  const str = String(value).trim();
  // If string contains comma, double quote, newline, or carriage return, enclose in quotes and escape quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Triggers a browser download of a CSV string with UTF-8 BOM
 */
function downloadCSV(csvContent: string, fileName: string) {
  // UTF-8 BOM ensures Excel / Numbers / LibreOffice open German umlauts correctly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports all provided events to a formatted CSV file
 */
export function exportEventsToCSV(events: TechnoEvent[], clubs: Club[], customFilename?: string) {
  const clubLookup = new Map<string, Club>();
  clubs.forEach((c) => clubLookup.set(c.id, c));

  const headers = [
    'ID',
    'Event-Titel',
    'Untertitel',
    'Stadt',
    'Club-Name',
    'Club-ID',
    'Stadtteil / Bezirk',
    'Datum (YYYY-MM-DD)',
    'Startzeit',
    'Endzeit',
    'Genres',
    'Lineup / DJs',
    'VVK-Preis (EUR)',
    'AK-Preis (EUR)',
    'Währung',
    'Ticket-Status',
    'Ticket-Anbieter',
    'Ticket-Direktlink',
    'Einlasspolitik / Dresscode',
    'Fotopolitik',
    'Mindestalter',
    'Awareness-Team & Nulltoleranz',
    'Soundsystem',
    'Quelle',
    'Agent-Entdeckt',
    'Erfassungsdatum',
    'Fehlende Web-Attribute (Zero-Halluzination)',
    'Suchverbesserungs-Tipp'
  ];

  const rows = events.map((evt) => {
    const club = clubLookup.get(evt.clubId);
    const city = evt.city || club?.city || 'Hamburg';
    const district = club ? `${club.neighborhood} (${club.district})` : '';
    const lineupStr = evt.lineup
      .map((a) => (typeof a === 'string' ? a : `${a.name}${a.role ? ` [${a.role}]` : ''}`))
      .join('; ');
    const genresStr = evt.genres.join(', ');
    const soundSys = evt.soundSystemNotes || club?.soundSystem || '';
    const missingStr = evt.missingAttributes && evt.missingAttributes.length > 0 ? evt.missingAttributes.join('; ') : 'Vollständig';
    const noticeStr = evt.missingNotice || '';

    return [
      escapeCSVCell(evt.id),
      escapeCSVCell(evt.title),
      escapeCSVCell(evt.subtitle || ''),
      escapeCSVCell(city),
      escapeCSVCell(evt.clubName),
      escapeCSVCell(evt.clubId),
      escapeCSVCell(district),
      escapeCSVCell(evt.date),
      escapeCSVCell(evt.startTime),
      escapeCSVCell(evt.endTime || ''),
      escapeCSVCell(genresStr),
      escapeCSVCell(lineupStr),
      escapeCSVCell(evt.price?.presale != null ? evt.price.presale : ''),
      escapeCSVCell(evt.price?.door != null ? evt.price.door : ''),
      escapeCSVCell(evt.price?.currency || 'EUR'),
      escapeCSVCell(evt.ticketStatus || ''),
      escapeCSVCell(evt.ticketProvider || ''),
      escapeCSVCell(evt.ticketUrl || ''),
      escapeCSVCell(evt.doorPolicyNotes || ''),
      escapeCSVCell(evt.photoPolicy || ''),
      escapeCSVCell(evt.minimumAge != null ? evt.minimumAge : ''),
      escapeCSVCell(evt.awarenessHighlights || ''),
      escapeCSVCell(soundSys),
      escapeCSVCell(evt.source),
      escapeCSVCell(evt.isAgentDiscovered ? 'Ja' : 'Nein'),
      escapeCSVCell(evt.discoveredAt),
      escapeCSVCell(missingStr),
      escapeCSVCell(noticeStr)
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = customFilename || `kraftwerk_events_${dateStr}.csv`;
  downloadCSV(csvContent, filename);
}

/**
 * Exports all provided clubs to a formatted CSV file
 */
export function exportClubsToCSV(clubs: Club[], customFilename?: string) {
  const headers = [
    'Club-ID',
    'Club-Name',
    'Badge / Auszeichnung',
    'Stadt',
    'Stadtteil',
    'Bezirk',
    'Adresse',
    'Postleitzahl',
    'Breitengrad (Lat)',
    'Längengrad (Lng)',
    'Beschreibung',
    'Typische Genres',
    'Outdoor / Garten (Open Air)',
    'Öffentlicher Nahverkehr (ÖPNV)',
    'Ø Eintrittspreis',
    'Soundsystem',
    'Tür-Strenge',
    'Dresscode',
    'Tür-Tipps',
    'Fotopolitik',
    'Mindestalter',
    'Zahlungsart',
    'Floors',
    'Awareness-Politik & Nulltoleranz',
    'Website',
    'Erstellt von',
    'Erstellt am',
    'Fehlende Web-Attribute (Zero-Halluzination)',
    'Suchoptimierung'
  ];

  const rows = clubs.map((c) => {
    const missingStr = c.missingAttributes && c.missingAttributes.length > 0 ? c.missingAttributes.join('; ') : 'Vollständig';
    return [
      escapeCSVCell(c.id),
      escapeCSVCell(c.name),
      escapeCSVCell(c.badge || ''),
      escapeCSVCell(c.city || 'Hamburg'),
      escapeCSVCell(c.neighborhood),
      escapeCSVCell(c.district || c.neighborhood),
      escapeCSVCell(c.address),
      escapeCSVCell(c.postalCode || ''),
      escapeCSVCell(c.coordinates?.lat || 0),
      escapeCSVCell(c.coordinates?.lng || 0),
      escapeCSVCell(c.description || c.history || c.vibe || ''),
      escapeCSVCell(c.typicalGenres ? c.typicalGenres.join('; ') : ''),
      escapeCSVCell(c.hasOutdoor ? 'Ja (Outdoor / Garten)' : 'Nein (Reiner Indoor)'),
      escapeCSVCell(c.publicTransit || c.transit?.station || ''),
      escapeCSVCell(c.entryAvg || ''),
      escapeCSVCell(c.soundSystem || ''),
      escapeCSVCell(c.doorPolicy?.strictness || 'Moderat'),
      escapeCSVCell(c.doorPolicy?.dressCode || 'Rave'),
      escapeCSVCell(c.doorPolicy?.tips || ''),
      escapeCSVCell(c.photoPolicy || 'Kamera abgeklebt'),
      escapeCSVCell(c.minimumAge || 18),
      escapeCSVCell(c.paymentMethod || 'Bar & Karte'),
      escapeCSVCell(c.floorsCount || 1),
      escapeCSVCell(c.awarenessPolicy || 'Awareness-Team available'),
      escapeCSVCell(c.website || c.websiteUrl || ''),
      escapeCSVCell(c.createdBy || 'Na,Helle.de (Live Sync)'),
      escapeCSVCell(c.createdAt || ''),
      escapeCSVCell(missingStr),
      escapeCSVCell(c.missingNotice || '')
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = customFilename || `kraftwerk_clubs_${dateStr}.csv`;
  downloadCSV(csvContent, filename);
}
