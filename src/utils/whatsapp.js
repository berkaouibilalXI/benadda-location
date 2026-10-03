export function buildWhatsAppMessage(t, d) {
  const blank = '…'
  const lines = [
    t('whatsapp.title'),
    `${t('whatsapp.name')}: ${d.name || blank}`,
    `${t('whatsapp.phone')}: ${d.phone || blank}`,
    `${t('whatsapp.car')}: ${d.carName || blank}`,
    `${t('whatsapp.days')}: ${d.days || blank}`,
  ]
  if (d.from) lines.push(`${t('whatsapp.from')}: ${d.from}`)
  if (d.to) lines.push(`${t('whatsapp.to')}: ${d.to}`)
  if (d.total) lines.push(`${t('whatsapp.total')}: ${d.total}`)
  lines.push(`${t('whatsapp.notes')}: ${d.notes?.trim() || '-'}`)
  return lines
}

export const buildWhatsAppUrl = (number, lines) =>
  `https://wa.me/${number}?text=${encodeURIComponent(lines.join('\n'))}`
